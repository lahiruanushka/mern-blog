const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12">
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
        About BlogNest
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 leading-8 mb-4">
        Welcome to{" "}
        <span className="font-semibold text-teal-500 dark:text-teal-400">
          BlogNest
        </span>
        ! Our mission is to provide developers, tech enthusiasts, and beginners
        with high-quality articles and tutorials on web development, software
        engineering, and programming languages. Whether you're looking to
        sharpen your coding skills or dive into a new technology, BlogNest has
        something for everyone.
      </p>
      <p className="text-lg text-gray-700 dark:text-gray-300 leading-8 mb-4">
        Created as a dynamic platform for educational purposes, BlogNest aims to
        foster a community of learners and creators, encouraging knowledge
        sharing and growth. We feature content on topics ranging from the basics
        of HTML and CSS to advanced JavaScript frameworks, backend development
        with Laravel, and more. Our goal is to create a repository of reliable
        and up-to-date content to help developers excel.
      </p>
      <p className="text-lg text-gray-700 dark:text-gray-300 leading-8 mb-4">
        Our platform allows users to explore recent posts, filter by categories,
        and find posts that match their interests. We are constantly working on
        enhancing the user experience and adding new features to improve the way
        our readers engage with content.
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-gray-100">
        What You'll Find on BlogNest
      </h2>
      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 leading-7">
        <li>
          In-depth tutorials on various programming languages and frameworks
        </li>
        <li>Latest trends and best practices in web development</li>
        <li>Tips and tricks for improving your coding skills</li>
        <li>Insights from industry experts</li>
        <li>A supportive community of fellow learners</li>
      </ul>
      <p className="text-lg text-gray-700 dark:text-gray-300 leading-8 mt-8">
        We're excited to have you here and can't wait for you to explore the
        world of development with us. Whether you're a seasoned developer or
        just starting, BlogNest is your go-to resource for all things tech.
      </p>
      <p className="text-lg text-gray-700 dark:text-gray-300 leading-8 mt-4">
        Feel free to explore, contribute, and share your own insights with our
        growing community. Happy learning and coding!
      </p>
    </div>
  );
};

export default AboutPage;
