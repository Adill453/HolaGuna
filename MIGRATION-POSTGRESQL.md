# Migration SQLite → PostgreSQL - Guide Complet

## ✅ Migration Terminée

Le projet a été migré avec succès de SQLite vers PostgreSQL. Toutes les modifications nécessaires ont été appliquées.

---

## 📋 Fichiers Modifiés

### 1. **prisma/schema.prisma**
- ✅ Provider changé de `sqlite` à `postgresql`
- ✅ Commentaire ajouté pour Prisma Accelerate

### 2. **lib/prisma.ts**
- ✅ Support de Prisma Accelerate en production
- ✅ Utilise `PRISMA_ACCELERATE_URL` si disponible, sinon `DATABASE_URL`
- ✅ Validation des variables d'environnement

### 3. **package.json**
- ✅ Script `db:reset` mis à jour pour PostgreSQL (utilise `prisma migrate reset`)

### 4. **Fichiers d'environnement**
- ✅ `env.example` : Mis à jour avec PostgreSQL et Prisma Accelerate
- ✅ `env.production` : Mis à jour avec PostgreSQL et Prisma Accelerate

### 5. **Nettoyage**
- ✅ Suppression de `prisma/kite-sports.db`
- ✅ Suppression de `prisma/prisma/dev.db`
- ✅ Suppression des anciennes migrations SQLite
- ✅ `prisma/migrations/migration_lock.toml` : Provider changé à `postgresql`

---

## 🔧 Configuration des Variables d'Environnement

### Pour le Développement Local

Créez un fichier `.env` à la racine du projet avec :

```env
# Database Configuration - PostgreSQL
DATABASE_URL="postgres://9f0a30c0f350c95e90847131495d8dd1ff99f17477bbad7bbb4bcf0a1f790cc9:sk_S9udrrFPN7GS2b4nZyyzT@db.prisma.io:5432/postgres?sslmode=require"

# Prisma Accelerate (optionnel pour développement)
PRISMA_ACCELERATE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19TOXVkcnJGUE43R1MyYjRuWnl5elQiLCJhcGlfa2V5IjoiMDFLQTY3QVFZTVdKUEdEUFFQNUE5UjU5NDEiLCJ0ZW5hbnRfaWQiOiI5ZjBhMzBjMGYzNTBjOTVlOTA4NDcxMzE0OTVkOGRkMWZmOTlmMTc0NzdiYmFkN2JiYjRiY2YwYTFmNzkwY2M5IiwiaW50ZXJuYWxfc2VjcmV0IjoiNTEwYTY3YzYtNTFlZS00MGM4LTljMGMtNjNiNTExMTIyZmY0In0.PvjuZEQV2SYLGvkjsB9uQvf37F4wxoq8Y2TEH7cZDgg"

# JWT Secret
JWT_SECRET="your-secret-key-change-in-production"

# Storage Configuration
STORAGE_TYPE="local"

# Autres variables...
```

### Pour Vercel (Production)

Dans les paramètres de votre projet Vercel, ajoutez ces variables d'environnement :

**Variables requises :**
- `DATABASE_URL` : `postgres://9f0a30c0f350c95e90847131495d8dd1ff99f17477bbad7bbb4bcf0a1f790cc9:sk_S9udrrFPN7GS2b4nZyyzT@db.prisma.io:5432/postgres?sslmode=require`
- `PRISMA_ACCELERATE_URL` : `prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19TOXVkcnJGUE43R1MyYjRuWnl5elQiLCJhcGlfa2V5IjoiMDFLQTY3QVFZTVdKUEdEUFFQNUE5UjU5NDEiLCJ0ZW5hbnRfaWQiOiI5ZjBhMzBjMGYzNTBjOTVlOTA4NDcxMzE0OTVkOGRkMWZmOTlmMTc0NzdiYmFkN2JiYjRiY2YwYTFmNzkwY2M5IiwiaW50ZXJuYWxfc2VjcmV0IjoiNTEwYTY3YzYtNTFlZS00MGM4LTljMGMtNjNiNTExMTIyZmY0In0.PvjuZEQV2SYLGvkjsB9uQvf37F4wxoq8Y2TEH7cZDgg`
- `JWT_SECRET` : Votre secret JWT de production
- `STORAGE_TYPE` : `cloudinary` ou `s3` (pas `local` sur Vercel)

**Note importante :** En production sur Vercel, le code utilisera automatiquement `PRISMA_ACCELERATE_URL` si disponible, ce qui est recommandé pour de meilleures performances.

---

## 🚀 Commandes à Exécuter Localement

### 1. Installer les dépendances
```bash
npm install
# ou
pnpm install
```

### 2. Générer le client Prisma
```bash
npm run db:generate
# ou
npx prisma generate
```

### 3. Créer la migration initiale PostgreSQL
```bash
npm run db:migrate:dev
# ou
npx prisma migrate dev --name init_postgresql
```

Cette commande va :
- Créer une nouvelle migration PostgreSQL basée sur votre `schema.prisma`
- Appliquer la migration à votre base de données
- Générer le client Prisma

### 4. (Optionnel) Appliquer les migrations existantes
Si vous avez déjà des migrations, appliquez-les :
```bash
npm run db:migrate
# ou
npx prisma migrate deploy
```

### 5. Peupler la base de données (Seed)
```bash
npm run db:seed
# ou
npx tsx prisma/seed.ts
```

### 6. Vérifier la connexion
```bash
npx prisma studio
```

Cela ouvrira Prisma Studio dans votre navigateur pour visualiser vos données.

---

## 📦 Déploiement sur Vercel

### Étape 1 : Configurer les Variables d'Environnement

1. Allez dans votre projet Vercel
2. Naviguez vers **Settings** → **Environment Variables**
3. Ajoutez toutes les variables nécessaires (voir section ci-dessus)

**Important :** 
- Configurez les variables pour **Production**, **Preview**, et **Development**
- Utilisez `PRISMA_ACCELERATE_URL` pour la production (recommandé)

### Étape 2 : Déployer

Vercel détectera automatiquement votre configuration et :
1. Exécutera `postinstall` (qui génère le client Prisma)
2. Exécutera `prisma generate` pendant la build (via `vercel.json`)
3. Appliquera les migrations si nécessaire

### Étape 3 : Vérifier le Déploiement

Après le déploiement, vérifiez que :
- ✅ La build s'est terminée sans erreur
- ✅ Les routes API fonctionnent correctement
- ✅ La base de données est accessible

---

## 🔍 Vérifications Post-Migration

### Vérifier que la migration a réussi :

1. **Connexion à la base de données :**
   ```bash
   npx prisma studio
   ```

2. **Vérifier les tables créées :**
   - `users`
   - `courses`
   - `activities`
   - `gallery`
   - `contacts`
   - `bookings`

3. **Tester une requête API :**
   ```bash
   curl http://localhost:3000/api/health
   ```

---

## ⚠️ Notes Importantes

### Prisma Accelerate vs DATABASE_URL

- **En développement :** Vous pouvez utiliser `DATABASE_URL` directement
- **En production (Vercel) :** Utilisez `PRISMA_ACCELERATE_URL` pour :
  - Meilleures performances
  - Gestion optimale des connexions
  - Cache des requêtes
  - Réduction de la latence

Le code dans `lib/prisma.ts` utilise automatiquement `PRISMA_ACCELERATE_URL` s'il est disponible, sinon il utilise `DATABASE_URL`.

### Storage sur Vercel

⚠️ **Important :** Le storage local (`STORAGE_TYPE=local`) ne fonctionne pas sur Vercel. Vous devez utiliser :
- `STORAGE_TYPE=cloudinary` avec les variables Cloudinary configurées
- `STORAGE_TYPE=s3` avec les variables AWS S3 configurées

---

## 🐛 Dépannage

### Erreur : "Missing DATABASE_URL or PRISMA_ACCELERATE_URL"
- Vérifiez que votre fichier `.env` contient `DATABASE_URL`
- Vérifiez que les variables sont bien définies sur Vercel

### Erreur : "Can't reach database server"
- Vérifiez que votre URL PostgreSQL est correcte
- Vérifiez que `sslmode=require` est présent dans l'URL
- Vérifiez que la base de données est accessible depuis votre réseau

### Erreur lors de la migration
- Assurez-vous que la base de données est vide ou que vous avez sauvegardé vos données
- Utilisez `prisma migrate reset` pour réinitialiser (⚠️ supprime toutes les données)

---

## 📚 Ressources

- [Documentation Prisma PostgreSQL](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [Prisma Accelerate](https://www.prisma.io/data-platform/accelerate)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

## ✅ Checklist de Migration

- [x] Schema Prisma mis à jour (provider = postgresql)
- [x] lib/prisma.ts mis à jour avec support Prisma Accelerate
- [x] Variables d'environnement configurées
- [x] Fichiers SQLite supprimés
- [x] Anciennes migrations SQLite supprimées
- [x] package.json mis à jour
- [x] Seed script vérifié (compatible PostgreSQL)
- [ ] Migration initiale créée (`npm run db:migrate:dev`)
- [ ] Base de données peuplée (`npm run db:seed`)
- [ ] Variables d'environnement configurées sur Vercel
- [ ] Déploiement testé sur Vercel

---

**Migration effectuée le :** $(date)
**Version Prisma :** 6.19.0
**Provider :** PostgreSQL

