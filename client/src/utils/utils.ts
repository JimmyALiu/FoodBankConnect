// utility file that contains helper functions for the client

export function demo_sum(a: any, b: any) {
    return a + b
}

// Function to find duplicate entries in an array of clients
export function findDuplicates(
    clients: Array<{ [key: string]: string }>
  ): Array<{ [key: string]: string }> {
    const duplicates: Array<{ [key: string]: string }> = [];
    const seen = new Set<string>();
    clients.forEach((client) => {
      const identifier = `${client["First Name"]} ${client["Last Name"]} ${client["Address"]} ${client["City"]} ${client["State"]}`;
      if (seen.has(identifier)) {
        duplicates.push({ ...client, Issue: "Duplicate Entry" });
      } else {
        seen.add(identifier);
      }
    });
    return duplicates;
  }

