export const faq = {
  badge: 'FAQ',
  title: 'Frequently Asked Questions',
  subtitle: 'Everything you need to know about our blockchain voting system',
  questions: {
    blockchain: {
      question: 'What is blockchain voting?',
      answer:
        "Blockchain voting uses distributed ledger technology to create a secure, transparent, and immutable record of votes. Each vote is encrypted and added to a Ethereum blockchain, making it virtually impossible to alter or delete votes once they've been cast.",
    },
    security: {
      question: 'Is blockchain voting secure?',
      answer:
        'Yes, blockchain voting is extremely secure. It uses cryptographic techniques to protect votes, distributes the voting record across multiple nodes to prevent tampering, and provides end-to-end encryption for voter privacy. Our system also undergoes regular security audits and penetration testing.',
    },
    privacy: {
      question: 'How does SmartVote ensure voter privacy?',
      answer:
        'SmartVote uses advanced cryptographic techniques including zero-knowledge proofs that allow voters to verify their vote was counted correctly without revealing who they voted for. The system separates voter identity verification from the actual voting process to ensure complete anonymity.',
    },
    verification: {
      question: 'Can voters verify their votes were counted correctly?',
      answer:
        'Yes, each voter receives a unique, anonymous receipt with a cryptographic key that allows them to verify their vote was recorded correctly on the blockchain without revealing their identity or how they voted.',
    },
    technical: {
      question: "What happens if there's a technical issue during voting?",
      answer:
        'Our system has multiple redundancies built in. If a voter experiences a technical issue, they can restart the voting process, and the system ensures no duplicate votes are counted. We also provide 24/7 technical support during election periods.',
    },
    accessibility: {
      question: 'Is SmartVote accessible to all voters?',
      answer:
        'Yes, SmartVote is designed with accessibility as a priority. The platform complies with WCAG 2.1 AA standards, supports screen readers, offers keyboard navigation, and provides interfaces in multiple languages. For voters without internet access, we work with election authorities to provide voting kiosks at traditional polling locations.',
    },
  },
  stillHaveQuestions: 'Still Have Questions?',
};
