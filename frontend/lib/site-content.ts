export const RESTAURANT = {
  name: 'Délices des Nations',
  phone: '+237 655 06 34 19',
  phoneHref: 'tel:+237655063419',
  address: 'Ndoumbie / Bibliothèque, Bertoua',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Ndoumbie%20Biblioth%C3%A8que%20Bertoua%20Cameroun',
};

export function whatsappLink(message: string) {
  return `https://wa.me/237655063419?text=${encodeURIComponent(message)}`;
}

export const OCCASIONS = [
  {
    number: '01',
    title: 'Mariages & dots',
    description: 'Un repas qui accompagne les retrouvailles, les traditions et les grands moments de votre famille.',
    detail: 'Parlons du nombre de convives, du lieu et du menu que vous imaginez.',
    message: 'Bonjour DENA, je souhaite préparer un mariage ou une dot. Pouvons-nous discuter du menu et du devis ?',
  },
  {
    number: '02',
    title: 'Fêtes & anniversaires',
    description: 'Un anniversaire, une célébration ou simplement le plaisir de réunir les personnes qui comptent.',
    detail: 'Partagez votre occasion et vos envies pour préparer une proposition.',
    message: 'Bonjour DENA, je souhaite organiser une fête ou un anniversaire. Pouvons-nous préparer une proposition ?',
  },
  {
    number: '03',
    title: 'Entreprises & réunions',
    description: 'Faites du repas un moment de convivialité pendant vos réunions et vos événements professionnels.',
    detail: 'Précisez la date, le lieu et le déroulement de votre événement.',
    message: 'Bonjour DENA, je souhaite un devis traiteur pour une réunion ou un événement professionnel.',
  },
  {
    number: '04',
    title: 'Rassemblements & hommages',
    description: 'Pour vos rencontres familiales et cérémonies, échangeons sur une organisation adaptée à votre occasion.',
    detail: 'Notre équipe est votre interlocutrice pour préciser vos besoins.',
    message: 'Bonjour DENA, je souhaite échanger sur un service traiteur pour un rassemblement familial ou une cérémonie.',
  },
];

export const ORDER_STEPS = [
  { number: '01', title: 'Découvrez le menu', description: 'Consultez les plats publiés pour la semaine et leurs prix en FCFA. Choisissez ceux qui vous font envie.' },
  { number: '02', title: 'Composez votre panier', description: 'Ajoutez vos plats, ajustez les quantités, puis renseignez votre nom et votre numéro de téléphone.' },
  { number: '03', title: 'Échangeons sur WhatsApp', description: 'Envoyez le récapitulatif de votre commande. Confirmez avec l’équipe la disponibilité, le paiement et les modalités de remise.' },
];

export const FAQS = [
  {
    question: 'Comment commander un repas ?',
    answer: 'Choisissez vos plats dans le menu, ajoutez-les au panier et indiquez vos coordonnées. Le bouton de commande vous permet ensuite de poursuivre sur WhatsApp avec un récapitulatif. L’équipe vous confirmera les disponibilités et les modalités de votre commande.',
  },
  {
    question: 'Que faire si le menu n’est pas encore affiché ?',
    answer: 'Vous pouvez nous appeler ou nous écrire directement sur WhatsApp pour connaître les plats disponibles. Le menu en ligne est mis à jour par l’équipe ; les disponibilités sont à confirmer au moment de votre commande.',
  },
  {
    question: 'Quelles informations fournir pour un devis traiteur ?',
    answer: 'Indiquez le type d’événement, la date souhaitée, le lieu, le nombre estimé de convives et votre budget indicatif. Ajoutez vos préférences de menu et vos contraintes particulières pour faciliter la préparation de la proposition.',
  },
  {
    question: 'Proposez-vous un retrait ou une livraison ?',
    answer: 'Précisez votre lieu et l’heure souhaitée lorsque vous contactez l’équipe. Nous vous indiquerons les possibilités de retrait ou de livraison, les éventuels frais et les conditions avant confirmation.',
  },
  {
    question: 'Comment signaler une allergie ou une préférence alimentaire ?',
    answer: 'Contactez-nous avant de confirmer votre commande et précisez les aliments concernés. L’équipe pourra vous renseigner sur la composition des plats et les adaptations possibles. Attendez sa confirmation avant de choisir un plat.',
  },
  {
    question: 'Quels sont les horaires et les moyens de paiement ?',
    answer: 'Appelez-nous ou écrivez-nous sur WhatsApp pour connaître les horaires du jour et les moyens de paiement disponibles. Pour une prestation traiteur, les conditions et les échéances sont à convenir lors de la confirmation du devis.',
  },
];
