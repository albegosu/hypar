-- better-auth: User, Session, Account, Verification tables

CREATE TABLE "User" (
    "id"            TEXT NOT NULL,
    "name"          TEXT NOT NULL,
    "email"         TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image"         TEXT,
    "role"          TEXT NOT NULL DEFAULT 'user',
    "banned"        BOOLEAN DEFAULT false,
    "banReason"     TEXT,
    "banExpires"    TIMESTAMP(3),
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Session" (
    "id"             TEXT NOT NULL,
    "expiresAt"      TIMESTAMP(3) NOT NULL,
    "token"          TEXT NOT NULL,
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP(3) NOT NULL,
    "ipAddress"      TEXT,
    "userAgent"      TEXT,
    "userId"         TEXT NOT NULL,
    "impersonatedBy" TEXT,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Account" (
    "id"                    TEXT NOT NULL,
    "accountId"             TEXT NOT NULL,
    "providerId"            TEXT NOT NULL,
    "userId"                TEXT NOT NULL,
    "accessToken"           TEXT,
    "refreshToken"          TEXT,
    "idToken"               TEXT,
    "accessTokenExpiresAt"  TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope"                 TEXT,
    "password"              TEXT,
    "createdAt"             TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"             TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Verification" (
    "id"         TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value"      TEXT NOT NULL,
    "expiresAt"  TIMESTAMP(3) NOT NULL,
    "createdAt"  TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"  TIMESTAMP(3),

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key"   ON "User"("email");
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
