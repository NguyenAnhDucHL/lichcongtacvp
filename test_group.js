const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('test_data.json', 'utf8'));
const arrayData = raw.data;

const getTodayStr = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

const parseDateStr = (rawDate) => {
  if (!rawDate) return null;
  const plain = rawDate.split('T')[0];
  if (rawDate.includes('T')) {
    const d = new Date(rawDate);
    if (!isNaN(d.getTime())) {
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }
  }
  return plain;
};

const todayStr = getTodayStr(); // Force to 2026-08-25
// Override todayStr for testing
const mockTodayStr = '2026-08-25';

const grouped = {};
arrayData.forEach((item) => {
  if (!item.date) return;
  const dateStr = parseDateStr(item.date);
  if (!dateStr) return;
  if (!grouped[dateStr]) grouped[dateStr] = [];
  grouped[dateStr].push(item);
});

const maxDate = new Date(mockTodayStr + 'T00:00:00');
maxDate.setDate(maxDate.getDate() + 7);
const maxStr = `${maxDate.getFullYear()}-${String(maxDate.getMonth() + 1).padStart(2, '0')}-${String(maxDate.getDate()).padStart(2, '0')}`;

const result = Object.keys(grouped)
  .sort()
  .filter((d) => d >= mockTodayStr && d <= maxStr)

console.log("Filtered keys:", result);
