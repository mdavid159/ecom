export interface JwtPayload {
  sub: string; // Typically the user ID
  email: string; // User email
  iat?: number; // Issued at (optional)
  exp?: number; // Expiration time (optional)
}
