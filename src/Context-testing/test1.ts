async function fetchUser(userId: string) {
  const response = await fetch(`https://api.example.com/users/${userId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
}

async function fetchUserWithRetry(userId: string) {
  let attempts = 0;

  while (attempts < 3) {
    try {
      return await fetchUser(userId);
    } catch (error) {
      attempts++;

      if (attempts === 3) {
        throw error;
      }
    }
  }
}

async function main() {
  const user = await fetchUserWithRetry("123");

  console.log("User:", user);
}

main();