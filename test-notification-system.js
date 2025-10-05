// Test script for the notification system
// This script tests the complete notification flow

const testNotificationSystem = async () => {
	console.log('🧪 Testing Notification System...\n');

	// Test 1: Check if notification settings API works
	console.log('1. Testing notification settings API...');
	try {
		const response = await fetch('http://localhost:3000/api/admin/notifications');
		if (response.ok) {
			console.log('✅ Notification settings API is accessible');
		} else {
			console.log('❌ Notification settings API returned:', response.status);
		}
	} catch (error) {
		console.log('❌ Error accessing notification settings API:', error.message);
	}

	// Test 2: Test contact form submission
	console.log('\n2. Testing contact form submission...');
	try {
		const testMessage = {
			name: 'Test User',
			email: 'test@example.com',
			subject: 'Test Message',
			message: 'This is a test message to verify the notification system works correctly.',
		};

		const response = await fetch('http://localhost:3000/api/public/contact', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(testMessage),
		});

		const result = await response.json();

		if (response.ok) {
			console.log('✅ Contact form submission successful');
			console.log('   Response:', result.message);
		} else {
			console.log('❌ Contact form submission failed:', result.error);
		}
	} catch (error) {
		console.log('❌ Error submitting contact form:', error.message);
	}

	// Test 3: Check if message was saved in database
	console.log('\n3. Testing message retrieval...');
	try {
		const response = await fetch('http://localhost:3000/api/admin/messages');
		if (response.ok) {
			const messages = await response.json();
			console.log('✅ Messages API accessible');
			console.log(`   Found ${messages.length} messages in database`);

			// Check if our test message is there
			const testMessage = messages.find((msg) => msg.email === 'test@example.com');
			if (testMessage) {
				console.log('✅ Test message found in database');
				console.log('   Message ID:', testMessage._id);
				console.log('   Status:', testMessage.status);
			} else {
				console.log('❌ Test message not found in database');
			}
		} else {
			console.log('❌ Messages API returned:', response.status);
		}
	} catch (error) {
		console.log('❌ Error accessing messages API:', error.message);
	}

	console.log('\n🎉 Notification system test completed!');
	console.log('\n📝 Next steps:');
	console.log('1. Configure email settings in admin panel (/admin/notifications)');
	console.log('2. Set up SMTP credentials in .env file');
	console.log('3. Test email notifications by submitting a real contact form');
};

// Run the test if this script is executed directly
if (typeof window === 'undefined') {
	// Node.js environment
	const fetch = require('node-fetch');
	testNotificationSystem();
} else {
	// Browser environment
	testNotificationSystem();
}
