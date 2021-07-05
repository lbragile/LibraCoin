// https://www.w3schools.com/css/css_rwd_mediaqueries.asp

export enum SIZES {
  xs = "600px",
  sm = "600px",
  md = "768px",
  lg = "992px",
  xl = "1200px"
}

export enum DEVICES {
  xs = "max-width: " + SIZES.xs,
  sm = "min-width: " + SIZES.sm,
  md = "min-width: " + SIZES.md,
  lg = "min-width: " + SIZES.lg,
  xl = "min-width: " + SIZES.xl
}
