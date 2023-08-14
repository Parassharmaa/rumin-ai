export const parseCsvToJson = (csv: string | undefined, separator = ",") => {
  if (!csv) {
    return [];
  }
  const lines = csv.split("\n");
  if (lines.length > 0) {
    const headers = lines[0] != undefined ? lines[0].split(separator) : [];
    const data = lines.slice(1).map((line) => {
      const values = line.split(",");
      const row = Object({});
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
      return row;
    });
    return data;
  }
};
