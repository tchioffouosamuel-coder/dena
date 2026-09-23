import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@dena.cm';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'ChangeMoi123!';

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: { email: adminEmail, passwordHash, name: 'Administrateur', role: Role.ADMIN },
    });
    console.log(`Compte admin créé : ${adminEmail} / ${adminPassword} (à changer immédiatement)`);
  }

  const dishCount = await prisma.dish.count();
  if (dishCount === 0) {
    await prisma.dish.createMany({
      data: [
        { day: 'LUNDI', name: 'Eru', description: 'Feuilles tendres mijotées avec écrevisses, poisson et ingrédients traditionnels.', price: 1500, position: 1 },
        { day: 'MARDI', name: 'Riz sauce tomate poisson', description: 'Riz blanc accompagné d’une savoureuse sauce tomate et poisson frit.', price: 1000, position: 2 },
        { day: 'MERCREDI', name: 'Ndolé', description: 'Spécialité camerounaise à base de feuilles amères, viande, arachides et poisson fumé.', price: 1500, position: 3 },
        { day: 'JEUDI', name: 'Eru', description: 'Une recette généreuse et savoureuse préparée avec soin.', price: 1500, position: 4 },
        { day: 'VENDREDI', name: 'Koki', description: 'Spécialité camerounaise à base de haricots, parfumée et préparée avec soin.', price: 1000, position: 5 },
        { day: 'SAMEDI', name: 'Pomme pilée', description: 'Une préparation généreuse et conviviale.', price: 1000, position: 6 },
        { day: 'DIMANCHE', name: 'Okok', description: 'Okok sucré, une spécialité camerounaise pleine de saveurs.', price: 1500, position: 7 },
      ],
    });
    console.log('Menu initial créé.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
