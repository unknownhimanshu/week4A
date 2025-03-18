// Import the required modules
const fs = require('fs');
const path = require('path');
const { Command } = require('commander');

// Initialize the command program
const program = new Command();

// Define the path to the tasks.json file
const filePath = path.join(__dirname, 'tasks.json');

// Ensure tasks.json file exists
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
}

// Load tasks from file
const loadTasks = () => {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
};

// Save tasks to file
const saveTasks = (tasks) => {
    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
};

const tasks = loadTasks();

// Define the add command
program
    .command('add <task>')
    .description('Add a new task')
    .action((task) => {
        tasks.push({ task, done: false });
        saveTasks(tasks);
        console.log(`✅ Task added: "${task}"`);
    });

// Define the list command
program
    .command('list')
    .description('Show all tasks')
    .action(() => {
        if (tasks.length === 0) {
            console.log('📌 No tasks found.');
        } else {
            console.log('\n📋 To-Do List:\n');
            tasks.forEach((t, index) => {
                console.log(`${index + 1}. ${t.done ? '✔️' : '❌'} ${t.task}`);
            });
        }
    });

// Define the done command
program
    .command('done <taskNumber>')
    .description('Mark task as done')
    .action((taskNumber) => {
        const index = parseInt(taskNumber) - 1;
        if (index < 0 || index >= tasks.length) {
            console.log('⚠️ Invalid task number.');
        } else {
            tasks[index].done = true;
            saveTasks(tasks);
            console.log(`🎉 Task marked as done: "${tasks[index].task}"`);
        }
    });

// Define the delete command
program
    .command('delete <taskNumber>')
    .description('Delete a task')
    .action((taskNumber) => {
        const index = parseInt(taskNumber) - 1;
        if (index < 0 || index >= tasks.length) {
            console.log('⚠️ Invalid task number.');
        } else {
            const deletedTask = tasks.splice(index, 1);
            saveTasks(tasks);
            console.log(`🗑️ Task deleted: "${deletedTask[0].task}"`);
        }
    });

// Parse the command-line arguments
program.parse(process.argv);
