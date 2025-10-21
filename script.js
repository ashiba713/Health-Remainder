// script.js
let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
const addBtn = document.getElementById('addReminderBtn');
addBtn.addEventListener('click', addReminder);

displayReminders();

function addReminder() {
  const text = document.getElementById('reminderInput').value;
  const time = document.getElementById('reminderTime').value;
  const type = document.getElementById('reminderType').value;
  const recurring = document.getElementById('recurring').checked;

  if(text && time) {
    const reminder = { text, time, type, recurring };
    reminders.push(reminder);
    saveReminders();
    displayReminders();
    scheduleNotification(reminder);

    document.getElementById('reminderInput').value = '';
    document.getElementById('reminderTime').value = '';
    document.getElementById('recurring').checked = false;
  }
}

function displayReminders() {
  const list = document.getElementById('reminderList');
  list.innerHTML = '';
  reminders.forEach((reminder, index) => {
    const li = document.createElement('li');
    li.className = reminder.type;
    li.textContent = `${reminder.text} at ${reminder.time} ${reminder.recurring ? '(Daily)' : ''}`;

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Delete';
    removeBtn.className = 'deleteBtn';
    removeBtn.onclick = () => {
      reminders.splice(index, 1);
      saveReminders();
      displayReminders();
    };

    li.appendChild(removeBtn);
    list.appendChild(li);

    scheduleNotification(reminder);
  });
}

function saveReminders() {
  localStorage.setItem('reminders', JSON.stringify(reminders));
}

function scheduleNotification(reminder) {
  const now = new Date();
  const [hours, minutes] = reminder.time.split(':');
  let reminderDate = new Date();
  reminderDate.setHours(hours);
  reminderDate.setMinutes(minutes);
  reminderDate.setSeconds(0);

  if(reminder.recurring && reminderDate < now){
    reminderDate.setDate(reminderDate.getDate() + 1);
  }

  const timeout = reminderDate - now;
  if(timeout > 0){
    setTimeout(() => {
      if(Notification.permission === 'granted'){
        new Notification('Health Reminder', { body: reminder.text });
      }
      if(reminder.recurring){
        scheduleNotification(reminder); // reschedule for next day
      }
    }, timeout);
  }
}

if(Notification.permission !== 'granted'){
  Notification.requestPermission();
}