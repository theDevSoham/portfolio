// Route-transition fallback. The client-side PageLoader (in the root layout)
// renders the loading overlay on navigation, so this stays empty to avoid a
// double overlay and, crucially, any flash on initial load.
export default function Loading() {
  return null;
}
