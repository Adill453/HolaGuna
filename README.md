# Ola Y Lagona





## Installation test last


1. Clone the repository:
    ```sh
    git clone https://github.com/Adill453/HolaGuna.git
    ```
   

3. Install dependencies:

    ```sh
    npm install
    ```
    
4. prisma generate:

    ```sh
    npx prisma generate 
    ```

5. Start the server:

    ```sh
    npm run dev
    ```
6. prisma studio (optional) :

    ```sh
    npx prisma studio 
    ```
7. seeders (optional) :
    (if you reset the db its reset the hosted one and if you seed, its changes too, so don't)
    ```sh
   npm run db:push
   npm run db:seed
    ```
## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env

# URL de la base de données PostgreSQL
DATABASE_URL="postgres://9f0a30c0f350c95e90847131495d8dd1ff99f17477bbad7bbb4bcf0a1f790cc9:sk_S9udrrFPN7GS2b4nZyyzT@db.prisma.io:5432/postgres?sslmode=require"

```

## Deployment

For production deployment, see the [DEPLOYMENT.md](./DEPLOYMENT.md) guide for detailed instructions.

### Quick Deployment Options:

1. **Traditional Server:** Use `deploy.bat` (Windows) or `deploy.sh` (Linux/Mac)
2. **Docker:** Use `deploy-docker.bat` (Windows) or `deploy-docker.sh` (Linux/Mac)
3. **Cloud Platforms:** Vercel, Railway, DigitalOcean App Platform

### Production Checklist:
- [ ] Change JWT_SECRET to a strong random string
- [ ] Set up HTTPS/SSL certificate
- [ ] Configure production database
- [ ] Set up monitoring and backups


## Running the Application

- The server will run on `http://localhost:3000`.
- The prisma studio server will run on `http://localhost:5555`.

