export const parseCsvToJson = (csv: string | undefined, separator = ",") => {
  if (!csv) {
    return [];
  }
  const lines = csv.trim().split("\n");
  if (lines.length > 0) {
    const headers = lines[0] != undefined ? lines[0].split(separator) : [];

    // strip double quotes from the header
    headers.forEach((header, index) => {
      headers[index] = header.replace(/"/g, "").trim();
    });

    const data = lines.slice(1).map((line) => {
      // split the current line into columns based on the double quotes
      const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

      const row = Object({});
      headers.forEach((header, index) => {
        // strip double quotes from the value
        const value = values[index]?.replace(/"/g, "");
        row[header] = value?.trim();
      });
      return row;
    });
    return data;
  }
};
