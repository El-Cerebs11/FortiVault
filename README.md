# FortiVault - Secure Password Manager

Welcome to FortiVault, our secure password manager designed with your security in mind. Easily store and manage your passwords, ensuring worry-free logins across all your accounts.

## Features
- **Secure Storage**: Your passwords are encrypted and stored securely.
- **User-Friendly Interface**: Easily manage and organize your passwords.
- **Multi-platform Access**: Access your passwords from anywhere, on any device.
- **Strong Authentication**: Ensure secure access to your account with robust authentication measures.

## Getting Started
To get started with FortiVault, follow these steps:

1. Clone the repository: `git clone https://github.com/fortivault/fortivault.git`
2. Install dependencies: `npm install`
3. Configure environment variables:
   - Create a `.env` file in the root directory of the project.
   - Add the following environment variables and replace the placeholder values with your own:
     ```
     NEXTAUTH_URL="http://localhost:3000"
     NODE_ENV="development"
     NEXTAUTH_SECRET="SuperSecret"
     POSTGRES_PRISMA_URL="postgres://username:password@localhost:5432/database"
     GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
     GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"
     ```
4. Run the application: `npm run dev`
5. Open your browser and navigate to `http://localhost:3000` to start using FortiVault.

## Environment Variables
- **NEXTAUTH_URL**: The base URL of the Next.js application.
- **NODE_ENV**: Environment mode. Set to `"prod"` for production.
- **NEXTAUTH_SECRET**: Secret key used for NextAuth.js authentication.
- **POSTGRES_PRISMA_URL**: URL for connecting to the PostgreSQL database.
- **GOOGLE_CLIENT_ID**: Google OAuth2 client ID for authentication.
- **GOOGLE_CLIENT_SECRET**: Google OAuth2 client secret for authentication.

## Technologies Used
- **Next.js**: React framework for building server-side rendered applications.
- **NextAuth.js**: Authentication library for Next.js applications.
- **PostgreSQL**: Relational database for storing encrypted passwords.
- **Prisma**: Database toolkit and ORM for Node.js and TypeScript.
- **OAuth2**: Protocol used for authentication, with Google as a provider.

## Contributing
Contributions are welcome! If you find any issues or have suggestions for improvements, feel free to open an issue or submit a pull request.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
Special thanks to the developers and contributors of the technologies used in this project.

---

**FortiVault** - Your Security, Our Priority
