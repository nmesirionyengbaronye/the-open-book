declare module 'bcryptjs' {
  export function compare(password: string, hash: string): Promise<boolean>;
  export function genSalt(rounds?: number): Promise<string>;
  export function hash(password: string, salt: string): Promise<string>;
}