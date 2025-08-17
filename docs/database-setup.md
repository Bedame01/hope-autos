# Database Setup Guide - Neon PostgreSQL + Prisma

This guide will help you set up a production-ready PostgreSQL database using Neon and Prisma ORM.

## 🚀 Quick Setup

### 1. Create Neon Database

1. Go to [Neon.tech](https://neon.tech) and create a free account
2. Create a new project called "hope-autos"
3. Copy your connection string from the dashboard
4. It should look like: `postgresql://username:password@host/database?sslmode=require`

### 2. Environment Variables

Create a `.env.local` file in your project root:

\`\`\`env
# Database
DATABASE_URL="your-neon-connection-string-here"

# NextAuth (generate with: npm run generate-secret)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret

# Optional: OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Optional: Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=hope-autos-cars
\`\`\`

### 3. Install Dependencies & Setup Database

\`\`\`bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
\`\`\`

### 4. Verify Setup

\`\`\`bash
# Open Prisma Studio to view your data
npm run db:studio
\`\`\`

## 📊 Database Schema

### Core Tables

- **users** - Customer and admin accounts
- **cars** - Vehicle inventory
- **inquiries** - Customer inquiries and leads
- **favorite_cars** - User's saved vehicles
- **user_preferences** - User settings and preferences
- **saved_searches** - Saved search filters

### Authentication Tables (NextAuth)

- **accounts** - OAuth provider accounts
- **sessions** - User sessions
- **verification_tokens** - Email verification

## 🔧 Available Scripts

\`\`\`bash
# Database Management
npm run db:generate    # Generate Prisma client
npm run db:push       # Push schema changes to database
npm run db:migrate    # Create and run migrations
npm run db:seed       # Seed database with sample data
npm run db:studio     # Open Prisma Studio (database GUI)

# Development
npm run dev           # Start development server
npm run build         # Build for production
npm run start         # Start production server
\`\`\`

## 🏗️ Database Features

### ✅ **Production Ready**
- **PostgreSQL** - Reliable, ACID-compliant database
- **Connection Pooling** - Efficient connection management
- **SSL Encryption** - Secure data transmission
- **Automatic Backups** - Built-in data protection

### ✅ **Type Safety**
- **Prisma ORM** - Type-safe database queries
- **Auto-generated Types** - TypeScript types from schema
- **Query Validation** - Compile-time query checking
- **IntelliSense Support** - Full IDE autocomplete

### ✅ **Performance**
- **Optimized Queries** - Efficient database operations
- **Indexing** - Fast lookups on common fields
- **Pagination** - Handle large datasets
- **Caching Ready** - Prepared for Redis integration

### ✅ **Scalability**
- **Horizontal Scaling** - Add read replicas
- **Vertical Scaling** - Increase compute resources
- **Connection Pooling** - Handle concurrent users
- **Migration System** - Safe schema updates

## 🔐 Security Features

- **Password Hashing** - bcrypt with salt rounds
- **SQL Injection Protection** - Parameterized queries
- **CSRF Protection** - NextAuth security
- **Session Management** - Secure JWT tokens

## 📈 Monitoring & Maintenance

### Database Health
- Monitor connection pool usage
- Track query performance
- Set up alerts for errors
- Regular backup verification

### Performance Optimization
- Analyze slow queries
- Add indexes for common searches
- Optimize N+1 query problems
- Monitor memory usage

## 🚨 Troubleshooting

### Common Issues

**Connection Error**
\`\`\`bash
Error: P1001: Can't reach database server
\`\`\`
- Check DATABASE_URL format
- Verify network connectivity
- Ensure database is running

**Migration Error**
\`\`\`bash
Error: P3009: migrate found failed migration
\`\`\`
- Reset database: `npx prisma migrate reset`
- Re-run migrations: `npm run db:migrate`

**Type Errors**
\`\`\`bash
Error: Property 'user' does not exist
\`\`\`
- Regenerate client: `npm run db:generate`
- Restart TypeScript server

### Getting Help

1. Check [Prisma Documentation](https://www.prisma.io/docs)
2. Visit [Neon Documentation](https://neon.tech/docs)
3. Search [GitHub Issues](https://github.com/prisma/prisma/issues)
4. Join [Prisma Discord](https://pris.ly/discord)

## 🎯 Next Steps

After setting up the database:

1. **Add Payment Processing** - Stripe integration
2. **Email Automation** - Resend for transactional emails
3. **Advanced Search** - Algolia for better filtering
4. **Analytics** - Track user behavior
5. **Caching** - Redis for performance

## 📝 Sample Data

The seed script creates:

- **Admin User**: admin@hopeautos.com / admin123
- **Customer User**: john@example.com / customer123
- **5 Sample Cars** - Various makes and models
- **Sample Inquiry** - Test customer inquiry

## 🔄 Data Migration

When moving from mock data to real database:

1. Export existing data (if any)
2. Run database setup
3. Import/transform data using seed script
4. Update API endpoints to use Prisma
5. Test all functionality

---

Your Hope Autos application now has a production-ready database! 🎉
\`\`\`

Finally, let's create a migration script to help transition from mock data:
