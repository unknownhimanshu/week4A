// Import the fs module for file system operations
const fs = require('fs');

// Define the path to the tasks.json file
const filePath = 'tasks.json';

// Ensure tasks.json file exists
if (!fs.existsSync(filePath)) {
    // If the file doesn't exist, create it and initialize with an empty array
    fs.writeFileSync(filePath, JSON.stringify([]));
}

// Load tasks from file
const loadTasks = () => {
    // Read the contents of the tasks.json file
    const data = fs.readFileSync(filePath, 'utf8');
    // Parse the JSON data and return the array of tasks
    return JSON.parse(data);
};

// Save tasks to file
const saveTasks = (tasks) => {
    // Write the tasks array to the tasks.json file, formatted with 2 spaces
    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
};

// Get command and arguments from the command-line arguments
const [,, command, ...args] = process.argv;
// Load the current tasks from the tasks.json file
const tasks = loadTasks();

// Commands
switch (command) {
    case 'add':
        // Join the arguments to form the task description
        const task = args.join(' ');
        if (!task) {
            // If no task description is provided, print an error message and exit
            console.log('❌ Please provide a task description.');
            process.exit(1);
        }
        // Add the new task to the tasks array
        tasks.push({ task, done: false });
        // Save the updated tasks array to the tasks.json file
        saveTasks(tasks);
        // Print a confirmation message
        console.log(`✅ Task added: "${task}"`);
        break;

    case 'list':
        if (tasks.length === 0) {
            // If there are no tasks, print a message
            console.log('📌 No tasks found.');
        } else {
            // Print the list of tasks with their status (done or not done)
            console.log('\n📋 To-Do List:\n');
            tasks.forEach((t, index) => {
                console.log(`${index + 1}. ${t.done ? '✔️' : '❌'} ${t.task}`);
            });
        }
        break;

    case 'done':
        // Parse the task number from the arguments
        const doneIndex = parseInt(args[0]) - 1;
        if (doneIndex < 0 || doneIndex >= tasks.length) {
            // If the task number is invalid, print an error message
            console.log('⚠️ Invalid task number.');
        } else {
            // Mark the task as done
            tasks[doneIndex].done = true;
            // Save the updated tasks array to the tasks.json file
            saveTasks(tasks);
            // Print a confirmation message
            console.log(`🎉 Task marked as done: "${tasks[doneIndex].task}"`);
        }
        break;

    case 'delete':
        // Parse the task number from the arguments
        const deleteIndex = parseInt(args[0]) - 1;
        if (deleteIndex < 0 || deleteIndex >= tasks.length) {
            // If the task number is invalid, print an error message
            console.log('⚠️ Invalid task number.');
        } else {
            // Delete the task from the tasks array
            const deletedTask = tasks.splice(deleteIndex, 1);
            // Save the updated tasks array to the tasks.json file
            saveTasks(tasks);
            // Print a confirmation message
            console.log(`🗑️ Task deleted: "${deletedTask[0].task}"`);
        }
        break;

    default:
        // Print usage instructions for the CLI
        console.log(`
📌 To-Do List CLI Usage:

  node todoCLI.js add "Task description"   ➝ Add a new task
  node todoCLI.js list                     ➝ Show all tasks
  node todoCLI.js done <task-number>       ➝ Mark task as done
  node todoCLI.js delete <task-number>     ➝ Delete a task
`);
}