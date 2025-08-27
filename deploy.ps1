# बडी बाज़ार डिप्लॉयमेंट स्क्रिप्ट (PowerShell)

Write-Host "=== बडी बाज़ार डिप्लॉयमेंट स्क्रिप्ट ==="
Write-Host "यह स्क्रिप्ट बडी बाज़ार ऐप्लिकेशन को बिल्ड और डिप्लॉय करेगा।"
Write-Host "======================================="

# फंक्शन्स
function Check-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# प्रीरिक्विसिट्स चेक
Write-Host "\nप्रीरिक्विसिट्स चेक कर रहे हैं..." -ForegroundColor Yellow

$prerequisites = @("node", "npm", "docker", "docker-compose")
$missing = @()

foreach ($tool in $prerequisites) {
    if (-not (Check-Command $tool)) {
        $missing += $tool
    }
}

if ($missing.Count -gt 0) {
    Write-Host "निम्नलिखित आवश्यक टूल्स नहीं मिले:" -ForegroundColor Red
    foreach ($tool in $missing) {
        Write-Host "- $tool" -ForegroundColor Red
    }
    Write-Host "कृपया इन्हें इंस्टॉल करें और फिर से प्रयास करें।" -ForegroundColor Red
    exit 1
}

Write-Host "सभी आवश्यक टूल्स उपलब्ध हैं।" -ForegroundColor Green

# एनवायरनमेंट फाइल्स चेक
Write-Host "\nएनवायरनमेंट फाइल्स चेक कर रहे हैं..." -ForegroundColor Yellow

$envFiles = @(
    "./deodap-backend-for-adminpanal/.env.production",
    "./Bazaar-buddy-main/.env.production"
)

$missingEnvFiles = @()

foreach ($file in $envFiles) {
    if (-not (Test-Path $file)) {
        $missingEnvFiles += $file
    }
}

if ($missingEnvFiles.Count -gt 0) {
    Write-Host "निम्नलिखित एनवायरनमेंट फाइल्स नहीं मिलीं:" -ForegroundColor Red
    foreach ($file in $missingEnvFiles) {
        Write-Host "- $file" -ForegroundColor Red
    }
    Write-Host "कृपया इन्हें बनाएं और अपने वैल्यूज़ से अपडेट करें।" -ForegroundColor Red
    exit 1
}

Write-Host "सभी आवश्यक एनवायरनमेंट फाइल्स उपलब्ध हैं।" -ForegroundColor Green

# API टेस्टिंग
Write-Host "\nAPI एंडपॉइंट्स टेस्ट कर रहे हैं..." -ForegroundColor Yellow

$testResult = $null

try {
    # बैकएंड सर्वर चल रहा है या नहीं, यह चेक करें
    $backendRunning = $false
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/api" -Method GET -TimeoutSec 5 -ErrorAction SilentlyContinue
        $backendRunning = $true
    } catch {
        $backendRunning = $false
    }

    if (-not $backendRunning) {
        Write-Host "बैकएंड सर्वर चालू नहीं है। API टेस्टिंग स्किप कर रहे हैं।" -ForegroundColor Yellow
    } else {
        # API टेस्ट स्क्रिप्ट रन करें
        node test-api-endpoints.js
        $testResult = $LASTEXITCODE
    }
} catch {
    Write-Host "API टेस्टिंग के दौरान एरर:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

if ($testResult -ne 0 -and $null -ne $testResult) {
    Write-Host "API टेस्ट फेल हो गए। क्या आप फिर भी डिप्लॉयमेंट जारी रखना चाहते हैं? (Y/N)" -ForegroundColor Yellow
    $continue = Read-Host
    if ($continue -ne "Y" -and $continue -ne "y") {
        Write-Host "डिप्लॉयमेंट रद्द कर दिया गया।" -ForegroundColor Red
        exit 1
    }
}

# डॉकर बिल्ड और डिप्लॉय
Write-Host "\nडॉकर इमेजेस बिल्ड कर रहे हैं..." -ForegroundColor Yellow

try {
    # डॉकर कंपोज़ बिल्ड
    docker-compose build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "डॉकर इमेजेस बिल्ड करने में एरर।" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "डॉकर इमेजेस सफलतापूर्वक बिल्ड हो गईं।" -ForegroundColor Green
    
    # डॉकर कंपोज़ अप
    Write-Host "\nकंटेनर्स स्टार्ट कर रहे हैं..." -ForegroundColor Yellow
    docker-compose up -d
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "कंटेनर्स स्टार्ट करने में एरर।" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "कंटेनर्स सफलतापूर्वक स्टार्ट हो गए।" -ForegroundColor Green
} catch {
    Write-Host "डॉकर बिल्ड/डिप्लॉय के दौरान एरर:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

# डिप्लॉयमेंट वेरिफिकेशन
Write-Host "\nडिप्लॉयमेंट वेरिफाई कर रहे हैं..." -ForegroundColor Yellow

$maxRetries = 10
$retryCount = 0
$backendUp = $false
$frontendUp = $false

while (($retryCount -lt $maxRetries) -and (-not ($backendUp -and $frontendUp))) {
    # बैकएंड चेक
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/api" -Method GET -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $backendUp = $true
            Write-Host "बैकएंड सर्विस चालू है।" -ForegroundColor Green
        }
    } catch {
        # कोई कार्रवाई नहीं
    }
    
    # फ्रंटएंड चेक
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $frontendUp = $true
            Write-Host "फ्रंटएंड सर्विस चालू है।" -ForegroundColor Green
        }
    } catch {
        # कोई कार्रवाई नहीं
    }
    
    if (-not ($backendUp -and $frontendUp)) {
        $retryCount++
        Write-Host "सर्विसेज स्टार्ट होने का इंतज़ार कर रहे हैं... ($retryCount/$maxRetries)" -ForegroundColor Yellow
        Start-Sleep -Seconds 5
    }
}

if ($backendUp -and $frontendUp) {
    Write-Host "\n=== डिप्लॉयमेंट सफल! ===" -ForegroundColor Green
    Write-Host "बैकएंड: http://localhost:5000/api" -ForegroundColor Cyan
    Write-Host "फ्रंटएंड: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "एडमिन डैशबोर्ड: http://localhost:3000/admin" -ForegroundColor Cyan
} else {
    Write-Host "\n=== डिप्लॉयमेंट वेरिफिकेशन फेल! ===" -ForegroundColor Red
    Write-Host "कृपया डॉकर लॉग्स चेक करें:" -ForegroundColor Yellow
    Write-Host "docker-compose logs" -ForegroundColor Yellow
}

Write-Host "\n=== डिप्लॉयमेंट प्रक्रिया पूरी हुई ===" -ForegroundColor Yellow