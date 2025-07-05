import React from 'react';

const CTA = () => {
  return (
    <section className="px-6 py-20 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Earning?</h2>
        <p className="text-xl text-gray-300 mb-8">
          Join thousands of users who are already making money by watching livestreams
        </p>
        <button className="bg-gradient-to-r from-purple-600 to-pink-600 px-12 py-4 rounded-lg text-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105">
          Launch livestakes.fun
        </button>
      </div>
    </section>
  );
};

export default CTA; 