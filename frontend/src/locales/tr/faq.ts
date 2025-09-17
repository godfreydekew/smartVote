export const faq = {
  badge: 'SSS',
  title: 'Sıkça Sorulan Sorular',
  subtitle: 'Blokzincir oy verme sistemimiz hakkında bilmeniz gereken her şey',
  questions: {
    blockchain: {
      question: 'Blokzincir oylaması nedir?',
      answer:
        'Blokzincir oylaması, oyların güvenli, şeffaf ve değiştirilemez bir kaydını oluşturmak için dağıtık defter teknolojisini kullanır. Her oy şifrelenir ve Ethereum blokzincirine eklenir, böylece oylar bir kez kullanıldıktan sonra değiştirilmesi veya silinmesi neredeyse imkânsız hale gelir.',
    },
    security: {
      question: 'Blokzincir oylaması güvenli mi?',
      answer:
        'Evet, blokzincir oylaması son derece güvenlidir. Oyları korumak için kriptografik teknikler kullanır, oylama kaydını birçok düğüme dağıtarak müdahaleyi önler ve seçmen gizliliği için uçtan uca şifreleme sağlar. Sistemimiz ayrıca düzenli güvenlik denetimlerinden ve sızma testlerinden geçmektedir.',
    },
    privacy: {
      question: 'SmartVote seçmen gizliliğini nasıl sağlıyor?',
      answer:
        'SmartVote, seçmenlerin oylarının doğru şekilde sayıldığını kime oy verdiklerini açıklamadan doğrulamalarına imkân tanıyan sıfır bilgi ispatları (zero-knowledge proofs) gibi gelişmiş kriptografik teknikler kullanır. Sistem, seçmen kimliği doğrulamasını oylama sürecinden ayırarak tam anonimlik sağlar.',
    },
    verification: {
      question: 'Seçmenler oylarının doğru sayıldığını doğrulayabilir mi?',
      answer:
        'Evet, her seçmen, kimliklerini veya kime oy verdiklerini açıklamadan oylarının blokzincire doğru kaydedildiğini doğrulamalarına imkân tanıyan kriptografik anahtara sahip benzersiz ve anonim bir makbuz alır.',
    },
    technical: {
      question: 'Oylama sırasında teknik bir sorun olursa ne olur?',
      answer:
        'Sistemimizde birden fazla yedek mekanizma bulunmaktadır. Bir seçmen teknik bir sorun yaşarsa oylama sürecini yeniden başlatabilir ve sistem, mükerrer oyların sayılmadığından emin olur. Ayrıca seçim dönemlerinde 7/24 teknik destek sunuyoruz.',
    },
    accessibility: {
      question: 'SmartVote tüm seçmenler için erişilebilir mi?',
      answer:
        'Evet, SmartVote erişilebilirliği öncelik olarak tasarlanmıştır. Platform WCAG 2.1 AA standartlarına uygundur, ekran okuyucuları destekler, klavye ile gezinme imkânı sunar ve çoklu dil desteği sağlar. İnternet erişimi olmayan seçmenler için ise seçim otoriteleriyle iş birliği yaparak geleneksel oy verme noktalarında kiosklar sağlıyoruz.',
    },
  },
  stillHaveQuestions: 'Hâlâ Sorularınız mı Var?',
};
