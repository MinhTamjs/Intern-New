// Setup script for MockAPI
// Run this script to populate your MockAPI with initial data

const API_CONFIG = {
  BASE_URL: 'https://6881dc8866a7eb81224c5612.mockapi.io',
  ENDPOINTS: {
    EMPLOYEES: '/employees',
    TASKS: '/tasks',
  },
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

const initialEmployees = [
  {
    name: 'John Admin',
    email: 'john@company.com',
    role: 'admin'
  },
  {
    name: 'Sarah Manager',
    email: 'sarah@company.com',
    role: 'manager'
  },
  {
    name: 'Mike Employee',
    email: 'mike@company.com',
    role: 'employee'
  }
];

const initialTasks = [
  {
    title: 'Design new landing page',
    description: 'Create a modern and responsive landing page for the new product',
    assigneeId: '3', // Mike Employee
    status: 'pending',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    title: 'Implement user authentication',
    description: 'Add JWT-based authentication system',
    assigneeId: '2', // Sarah Manager
    status: 'in-progress',
    createdAt: '2024-01-14T09:00:00Z',
    updatedAt: '2024-01-16T14:30:00Z'
  },
  {
    title: 'Write API documentation',
    description: 'Create comprehensive API documentation for developers',
    assigneeId: '1', // John Admin
    status: 'in-review',
    createdAt: '2024-01-13T11:00:00Z',
    updatedAt: '2024-01-17T16:00:00Z'
  },
  {
    title: 'Setup CI/CD pipeline',
    description: 'Configure automated testing and deployment pipeline',
    assigneeId: '2', // Sarah Manager
    status: 'done',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-18T12:00:00Z'
  }
];

async function setupMockAPI() {
  console.log('🚀 Setting up MockAPI with initial data...\n');

  try {
    // Create employees
    console.log('📝 Creating employees...');
    const employeeIds = [];
    
    for (const employee of initialEmployees) {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.EMPLOYEES}`, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify(employee),
      });
      
      if (response.ok) {
        const createdEmployee = await response.json();
        employeeIds.push(createdEmployee.id);
        console.log(`✅ Created employee: ${employee.name} (ID: ${createdEmployee.id})`);
      } else {
        console.log(`❌ Failed to create employee: ${employee.name}`);
      }
    }

    // Create tasks (using the employee IDs we just created)
    console.log('\n📋 Creating tasks...');
    
    for (const task of initialTasks) {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TASKS}`, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify(task),
      });
      
      if (response.ok) {
        const createdTask = await response.json();
        console.log(`✅ Created task: ${task.title} (ID: ${createdTask.id})`);
      } else {
        console.log(`❌ Failed to create task: ${task.title}`);
      }
    }

    console.log('\n🎉 Setup complete! Your MockAPI is now populated with sample data.');
    console.log('\n📊 You can now:');
    console.log('   - Start your development server: npm run dev');
    console.log(`   - View your data at: ${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.EMPLOYEES}`);
    console.log(`   - View your data at: ${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TASKS}`);

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n💡 Make sure your MockAPI endpoints are properly configured:');
    console.log('   - /employees (with fields: name, email, role)');
    console.log('   - /tasks (with fields: title, description, assigneeId, status, createdAt, updatedAt)');
  }
}

// Run the setup
setupMockAPI(); 