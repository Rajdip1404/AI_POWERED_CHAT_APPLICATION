return (
  <div className="h-screen bg-gray-900 flex justify-center items-center">
    <div className="max-w-md w-full mx-auto p-4 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-white mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-white text-sm mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 pl-10 text-sm text-white rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600"
          />
        </div>
        <div className="mb-4">
          <label className="block text-white text-sm mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 pl-10 text-sm text-white rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600"
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 text-sm text-white rounded-lg bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
        >
          Login
        </button>
      </form>
      <p className="text-white text-sm mt-4">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-500 hover:text-blue-700">
          Create one
        </Link>
      </p>
    </div>
  </div>
);
