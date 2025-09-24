export function getRows() {
  if (window.innerHeight <= 600) {
    return 5;
  }

  if (window.innerHeight <= 768) {
    return 8;
  }

  if (window.innerHeight <= 1024) {
    return 10;
  }

  if (window.innerHeight <= 1200) {
    return 15;
  }

  if (window.innerHeight <= 1400) {
    return 18;
  }

  return 25;
}

export function getRowsPerPageOptions() {
  return [5, 8, 10, 15, 18, 25, 30, 50];
}
