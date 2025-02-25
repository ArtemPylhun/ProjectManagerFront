import "../../styles/notFoundPageStyles.css";

const NotFoundPage = () => {
  return (
    <div>
      <div className="not-found-content">
        <h1>Not Found!</h1>
        <p>
          Oops! The page you’re looking for doesn’t exist or has been moved.
        </p>
        <a href="/" className="back-home-link">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;
