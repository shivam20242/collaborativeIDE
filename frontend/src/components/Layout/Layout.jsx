import Header from './Header'
import './Layout.css'

// Make sure you use export default
export default function Layout({ children }) {
  return (
    <div className="layout">
      <Header />
      <main className="layout-main">
        {children}
      </main>
    </div>
  )
}