class AuthService {
  authorize(username, password) {
    if (username && password && process.env[username] === password) {
      return true;
    }

    return false;
  }
}

export const authService = new AuthService();
