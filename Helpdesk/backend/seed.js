const mongoose = require("mongoose");
const User = require("./models/User");
const Issue = require("./models/Word");

async function seedDatabase() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/helpdesk");

    // Create default admin
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const admin = new User({
        username: 'admin',
        password: 'admin123',
        email: 'admin@helpdesk.com',
        name: 'System Administrator',
        role: 'admin'
      });
      await admin.save();
      console.log('✅ Default admin created: admin/admin123');
    }

    // Create sample employees
    const employees = [
      { username: 'john', password: 'emp123', email: 'john@helpdesk.com', name: 'John Smith', role: 'employee' },
      { username: 'sarah', password: 'emp123', email: 'sarah@helpdesk.com', name: 'Sarah Johnson', role: 'employee' }
    ];

    for (const emp of employees) {
      const exists = await User.findOne({ username: emp.username });
      if (!exists) {
        await new User(emp).save();
        console.log(`✅ Employee created: ${emp.username}/${emp.password}`);
      }
    }

    // Create sample issues
    const adminUser = await User.findOne({ role: 'admin' });
    const sampleIssues = [
      {
        issueCode: 'NET-001',
        title: 'Cannot connect to WiFi',
        description: 'User cannot connect to office WiFi network',
        solution: '1. Check if WiFi is enabled on device\n2. Forget and reconnect to network\n3. Reset network settings\n4. Contact IT if problem persists',
        category: 'Network',
        tags: ['wifi', 'connection', 'network'],
        difficulty: 'Easy',
        createdBy: adminUser._id
      },
      {
        issueCode: 'SOFT-001',
        title: 'Microsoft Office not opening',
        description: 'Office applications fail to launch',
        solution: '1. Restart computer\n2. Repair Office installation\n3. Update Office\n4. Reinstall if necessary',
        category: 'Software',
        tags: ['office', 'microsoft', 'application'],
        difficulty: 'Medium',
        createdBy: adminUser._id
      },
      {
        issueCode: 'HW-001',
        title: 'Printer not responding',
        description: 'Printer shows offline or not responding',
        solution: '1. Check printer power and connections\n2. Restart printer\n3. Clear print queue\n4. Reinstall printer drivers',
        category: 'Hardware',
        tags: ['printer', 'hardware', 'drivers'],
        difficulty: 'Medium',
        createdBy: adminUser._id
      },
      {
        issueCode: 'EMAIL-001',
        title: 'Cannot send emails',
        description: 'Outlook shows error when sending emails',
        solution: '1. Check internet connection\n2. Verify email credentials\n3. Clear Outlook cache\n4. Check email server settings',
        category: 'Email',
        tags: ['outlook', 'email', 'sending'],
        difficulty: 'Easy',
        createdBy: adminUser._id
      },
      {
        issueCode: 'PASS-001',
        title: 'Forgot password',
        description: 'User forgot login password',
        solution: '1. Use password reset link\n2. Contact IT helpdesk\n3. Verify identity\n4. Reset password following security guidelines',
        category: 'Password',
        tags: ['password', 'login', 'reset'],
        difficulty: 'Easy',
        createdBy: adminUser._id
      }
    ];

    for (const issue of sampleIssues) {
      const exists = await Issue.findOne({ issueCode: issue.issueCode });
      if (!exists) {
        await new Issue(issue).save();
        console.log(`✅ Issue created: ${issue.issueCode} - ${issue.title}`);
      }
    }

    console.log('🎉 Database seeded successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();