import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import styles from './Home.module.css';

export function HomePage() {
	return (
		<div className={styles.dashboardContainer}>
			<nav className={styles.sidebar}>
				<div className={styles.sidebarHeader}>
					<h2>Menu</h2>
				</div>
				<ul className={styles.sidebarMenu}>
					<li>
						<Link className={styles.dashboardLink} to='/profile'>
							Profile
						</Link>
					</li>
					<li>
						<Link className={styles.dashboardLink} to='/new-ride'>
							New ride
						</Link>
					</li>
					<li>
						<Link className={styles.dashboardLink} to='/previous'>
							Previous rides
						</Link>
					</li>
					<li>
						<Link
							className={styles.dashboardLink}
							to='/verification'
						>
							Verification
						</Link>
					</li>
					<li>
						<Link className={styles.dashboardLink} to='/new-ride'>
							New rides
						</Link>
					</li>
					<li>
						<Link className={styles.dashboardLink} to='/my-rides'>
							My rides
						</Link>
					</li>
					<li>
						<Link className={styles.dashboardLink} to='/all-rides'>
							All rides
						</Link>
					</li>
				</ul>
			</nav>
			<div className={styles.mainContent}>
				<header className={styles.topbar}>
					<h1>Dashboard</h1>
					<div className={styles.userInfo}>
						<p>Welcome, User</p>
						<Link to='/logout'>Logout</Link>
					</div>
				</header>
				<Outlet />
			</div>
		</div>
	);
}
