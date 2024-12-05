# OMS API

This is the **OMS API** (World Health Organization API) for managing epidemiological outbreaks and providing health recommendations. It is built with **Node.js** and uses **MongoDB** and **SQLite** for data storage. The API allows WHO administrators and employees to manage data related to outbreaks, countries, viruses, zones and guidelines. It also includes authentication and authorization features, ensuring secure access based on user roles (admin, employee).

## Features

- **CRUD Operations**: Manage countries, zones, viruses, outbreaks, and recommendations.
- **Role-based Authentication & Authorization**: Admins can create/edit/delete data, while employees can only create/edit.
- **Swagger Documentation**: API documentation is automatically generated and accessible via Swagger UI.
- **Testing**: The application includes Jest and Supertest for testing the API.
- **SQLite**: Local authentication and authorization processes using an SQLite database.

## Prerequisites

- **Node.js**: v16 or later
- **MongoDB**: Running locally or using a cloud instance

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/UPskill-Javascript/U24T05-G4_OMS_BE
   cd U24T05-G4_OMS_BE
   ```

2. Install dependencies:

   ```
   yarn install
   ```

   Alternatively, use npm:

   ```
   npm install
   ```

3. Create a `.env` file based on `.env.sample` and enter your variables:

   ```
   cp .env.sample .env
   ```

4. Run the application:

   For development mode (with live reload):

   ```
   yarn dev
   ```

   For production mode:

   ```
   yarn start
   ```

5. To run tests:

   ```
   yarn test
   ```

   Alternatively:

   ```
   npm test
   ```

## Docker

1. To run with docker, follow the BUILD.md instructions

## License

This project is licensed under the MIT License.

## Contact

This project was developed by Capicua Team with support from UpSkill.

- Lucas Garcia: [GitHub](https://github.com/garcialucasm)
- Luis Pires: [GitHub](https://github.com/Luis-Pires)
- Telmo Nunes: [GitHub](https://github.com/Tgbn99)
