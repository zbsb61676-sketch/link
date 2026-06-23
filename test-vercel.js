async function test() {
  try {
    const res = await fetch('https://link-e3kfx579y-zbsb61676-sketchs-projects.vercel.app/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test User', email: 'test_vercel_' + Date.now() + '@example.com', password: 'password123' })
    });
    const data = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", data);
  } catch (e) {
    console.error(e);
  }
}
test();
