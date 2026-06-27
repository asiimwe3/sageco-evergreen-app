# DeryLoan APK Setup Guide

## 1. Generate Your Keystore (run once locally)

```bash
keytool -genkey -v \
  -keystore sageco-release.jks \
  -alias sageco \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -dname "CN=Sageco Evergreen, OU=Derycode, O=Sageco, L=Kampala, S=Central, C=UG"
```

## 2. Add GitHub Secrets

Go to: https://github.com/asiimwe3/sageco-evergreen-app/settings/secrets/actions

Add these 3 secrets:

| Secret Name      | Value                                      |
|------------------|--------------------------------------------|
| KEYSTORE_BASE64  | base64 -w 0 sageco-release.jks             |
| STORE_PASSWORD   | your keystore password                     |
| KEY_PASSWORD     | your key password                          |

To get KEYSTORE_BASE64 run:
```bash
base64 -w 0 sageco-release.jks
```

## 3. Copy local.properties.template

```bash
cp local.properties.template local.properties
# Then fill in your passwords
```

## 4. Push to main — GitHub Actions builds the signed APK automatically

Download the APK from:
https://github.com/asiimwe3/sageco-evergreen-app/actions
