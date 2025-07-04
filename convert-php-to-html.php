<?php
if ($argc < 3) {
    echo "Usage: php convert-php-to-html.php input.php output.html\n";
    exit(1);
}

$input = $argv[1];
$output = $argv[2];

// Check that file exists
if (!file_exists($input)) {
    echo "Error: Input file '$input' not found.\n";
    exit(1);
}

// Start output buffering
ob_start();

// Include and execute the PHP file
include $input;

// Get rendered HTML content
$htmlContent = ob_get_clean();

// Save the content to an HTML file
file_put_contents($output, $htmlContent);

echo "✅ Converted '$input' to '$output'\n";