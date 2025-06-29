package main

import (
	"crypto"
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha256"
	"crypto/x509"
	"encoding/base64"
	"encoding/json"
	"encoding/pem"
	"fmt"
	"os"
	"time"
)

// TestPayload structure for signing
// Define the structure for the payload and the wrapper

type Payload struct {
	UserID    string `json:"user_id"`
	ProductID string `json:"product_id"`
	Env       string `json:"env"`
	Expiry    int64  `json:"expiry"`
}

type TestPayload struct {
	Payload   Payload `json:"payload"`
	Signature string  `json:"signature"`
}

func main() {
	fmt.Println("[DEBUG] Starting main()...")
	result, err := GenerateTestData("./", "6adca7b76d0c436e96748c5008f3d361", "TGSHININGLIGHTS2", "production")
	if err != nil {
		fmt.Println("[ERROR] GenerateTestData failed:", err)
		return
	}
	fmt.Println("[DEBUG] Generated Token:")
	fmt.Println(result)

	token := result // Use the generated token
	publicKeyPath := "production-public.pem" // Use the correct public key path

	fmt.Println("[DEBUG] Verifying token...")
	verifyErr := VerifyToken(token, publicKeyPath)
	if verifyErr != nil {
		fmt.Println("[ERROR] Verification failed:", verifyErr)
	} else {
		fmt.Println("[DEBUG] Verification succeeded.")
	}
}

// GenerateTestData creates a test payload and signs it with a private key
func GenerateTestData(privateKeyPath string, userId string, productId string, env string) (string, error) {
	fmt.Printf("[DEBUG] Generating test data for userId=%s, productId=%s, env=%s\n", userId, productId, env)
	// Create test payload
	testData := TestPayload{}
	testData.Payload.UserID = userId
	testData.Payload.ProductID = productId
	testData.Payload.Env = env
	testData.Payload.Expiry = time.Now().Add(24 * time.Hour).UnixMilli()
	fmt.Printf("[DEBUG] TestPayload: %+v\n", testData.Payload)

	// Read private key
	keyPath := privateKeyPath + env + "-private.pem"
	fmt.Printf("[DEBUG] Reading private key from: %s\n", keyPath)
	privateKeyBytes, err := os.ReadFile(keyPath)
	if err != nil {
		return "", fmt.Errorf("error reading private key: %v", err)
	}
	fmt.Printf("[DEBUG] Private key bytes length: %d\n", len(privateKeyBytes))

	// Decode PEM block
	block, _ := pem.Decode(privateKeyBytes)
	if block == nil {
		return "", fmt.Errorf("failed to decode PEM block")
	}
	fmt.Printf("[DEBUG] PEM block type: %s\n", block.Type)

	// Parse private key
	privateKeyInterface, err := x509.ParsePKCS8PrivateKey(block.Bytes)
	if err != nil {
		return "", fmt.Errorf("error parsing private key: %v", err)
	}
	privateKey, ok := privateKeyInterface.(*rsa.PrivateKey)
	if !ok {
		return "", fmt.Errorf("private key is not an RSA key")
	}
	fmt.Printf("[DEBUG] Parsed RSA private key.\n")

	// Convert payload to JSON string
	payloadBytes, err := json.Marshal(testData.Payload)
	if err != nil {
		return "", fmt.Errorf("error marshaling payload: %v", err)
	}
	fmt.Printf("[DEBUG] Marshaled payload: %s\n", string(payloadBytes))

	// Sign the payload
	hasher := sha256.New()
	hasher.Write(payloadBytes)
	hashed := hasher.Sum(nil)
	fmt.Printf("[DEBUG] SHA256 hash of payload: %x\n", hashed)

	signature, err := rsa.SignPKCS1v15(rand.Reader, privateKey, crypto.SHA256, hashed)
	if err != nil {
		return "", fmt.Errorf("error signing payload: %v", err)
	}
	fmt.Printf("[DEBUG] Signature (raw bytes): %x\n", signature)

	// Encode signature to base64
	testData.Signature = base64.StdEncoding.EncodeToString(signature)
	fmt.Printf("[DEBUG] Signature (base64): %s\n", testData.Signature)

	// Convert entire test data to JSON
	finalBytes, err := json.Marshal(testData)
	if err != nil {
		return "", fmt.Errorf("error marshaling final data: %v", err)
	}
	fmt.Printf("[DEBUG] Marshaled final TestPayload: %s\n", string(finalBytes))

	// Encode to base64
	encodedData := base64.StdEncoding.EncodeToString(finalBytes)
	fmt.Printf("[DEBUG] Encoded token: %s\n", encodedData)
	return encodedData, nil
}

// VerifyToken decodes, verifies, and logs the token data
func VerifyToken(token string, publicKeyPath string) error {
	fmt.Println("[DEBUG] Decoding base64 token...")
	finalBytes, err := base64.StdEncoding.DecodeString(token)
	if err != nil {
		return fmt.Errorf("error decoding base64 token: %v", err)
	}
	fmt.Printf("[DEBUG] Decoded token bytes length: %d\n", len(finalBytes))

	// Unmarshal JSON
	var testData TestPayload
	fmt.Println("[DEBUG] Unmarshaling token JSON...")
	if err := json.Unmarshal(finalBytes, &testData); err != nil {
		return fmt.Errorf("error unmarshaling token: %v", err)
	}
	fmt.Printf("[DEBUG] Unmarshaled TestPayload: %+v\n", testData)

	// Read public key
	fmt.Printf("[DEBUG] Reading public key from: %s\n", publicKeyPath)
	publicKeyBytes, err := os.ReadFile(publicKeyPath)
	if err != nil {
		return fmt.Errorf("error reading public key: %v", err)
	}
	fmt.Printf("[DEBUG] Public key bytes length: %d\n", len(publicKeyBytes))

	// Decode PEM block
	block, _ := pem.Decode(publicKeyBytes)
	if block == nil {
		return fmt.Errorf("failed to decode PEM block")
	}
	fmt.Printf("[DEBUG] PEM block type: %s\n", block.Type)

	// Parse public key
	publicKeyInterface, err := x509.ParsePKIXPublicKey(block.Bytes)
	if err != nil {
		return fmt.Errorf("error parsing public key: %v", err)
	}
	publicKey, ok := publicKeyInterface.(*rsa.PublicKey)
	if !ok {
		return fmt.Errorf("public key is not an RSA key")
	}
	fmt.Printf("[DEBUG] Parsed RSA public key.\n")

	// Marshal payload for signature verification
	payloadBytes, err := json.Marshal(testData.Payload)
	if err != nil {
		return fmt.Errorf("error marshaling payload: %v", err)
	}
	fmt.Printf("[DEBUG] Marshaled payload for verification: %s\n", string(payloadBytes))

	hasher := sha256.New()
	hasher.Write(payloadBytes)
	hashed := hasher.Sum(nil)
	fmt.Printf("[DEBUG] SHA256 hash of payload: %x\n", hashed)

	// Decode signature
	signature, err := base64.StdEncoding.DecodeString(testData.Signature)
	if err != nil {
		return fmt.Errorf("error decoding signature: %v", err)
	}
	fmt.Printf("[DEBUG] Decoded signature (raw bytes): %x\n", signature)

	// Verify signature
	err = rsa.VerifyPKCS1v15(publicKey, crypto.SHA256, hashed, signature)
	if err != nil {
		return fmt.Errorf("signature verification failed: %v", err)
	}

	// Log the payload data
	fmt.Printf("[DEBUG] Token is valid!\n")
	fmt.Printf("[DEBUG] Payload: %+v\n", testData.Payload)
	return nil
}