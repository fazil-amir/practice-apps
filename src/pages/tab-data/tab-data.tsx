import './tab-data.css';
import { useState } from 'react'
import ProfileTab from './profile-tab';
import InterestsTab from './interests-tab';

const profileValidation = (data: TabDataType) => {
	if (!data.name) {
		return 'Name is required';
	}
	if (!data.age) {
		return 'Age is required';
	}
	if (!data.email) {
		return 'Email is required';
	}
	return null;
}

const TABS = [
	{
		id: 'profile',
		label: 'Profile',
		component: ProfileTab,
		validate: (d: TabDataType) => profileValidation(d)
	},
	{ id: 'interests', label: 'Interests', component: InterestsTab },
];

export type TabDataType = {
	name: string;
	age: number;
	email: string;
	interests: string[];
}

export default function TabData() {
	const [data, setData] = useState<TabDataType>({
		name: 'Fazil Amir',
		age: 32,
		email: 'fazil.amir@example.com',
		interests: ['Coding', 'Traveling', 'Cooking'],
	});
	const [activeTabIndex, setActiveTabIndex] = useState(0);
	const ActiveTabComponent = TABS[activeTabIndex].component;

	const handleTabChange = (index: number) => {
		const validate = TABS[activeTabIndex].validate;
		if (validate) {
			const error = validate(data);
			if (error) {
				alert(error);
				return;
			}
		}
		setActiveTabIndex(index);
	}


	return (
		<>
			<h1>Tab Data</h1>
			<div className="tab-bar" role="tablist">
				{TABS.map((tab, index) => (
					<button
						key={tab.id}
						type="button"
						role="tab"
						aria-selected={activeTabIndex === index}
						className={`tab${activeTabIndex === index ? ' tab--active' : ''}`}
						onClick={() => handleTabChange(index)}
					>
						{tab.label}
					</button>
				))}
			</div>

			<div className="tab-panel" role="tabpanel">
				<ActiveTabComponent data={data} setData={setData} />
			</div>

			<div className="tab-footer">
				<div>
					{activeTabIndex > 0 && (
						<button type="button" onClick={() => handleTabChange(activeTabIndex - 1)}>
							Previous
						</button>
					)}
				</div>
				<div>
					{activeTabIndex < TABS.length - 1 && (
						<button type="button" onClick={() => handleTabChange(activeTabIndex + 1)}>
							Next
						</button>
					)}
					{activeTabIndex === TABS.length - 1 && (
						<button type="button" className="btn-primary" onClick={() => console.log(data)}>
							Submit
						</button>
					)}
				</div>
			</div>
		</>
	);
}
