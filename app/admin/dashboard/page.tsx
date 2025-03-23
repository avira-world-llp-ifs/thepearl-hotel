const AdminDashboardPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="w-full mb-8">
        <h2>Dashboard Overview</h2>
        <p>Welcome to the admin dashboard!</p>
      </section>

      <section className="w-full mb-8">
        <h3>Recent Activity</h3>
        <ul>
          <li>User A created a new post.</li>
          <li>User B updated their profile.</li>
        </ul>
      </section>

      <section className="w-full mb-8">
        <h3>Analytics</h3>
        <p>Here are some key metrics:</p>
        <ul>
          <li>Total Users: 100</li>
          <li>Active Users: 50</li>
        </ul>
      </section>
    </div>
  )
}

export default AdminDashboardPage

