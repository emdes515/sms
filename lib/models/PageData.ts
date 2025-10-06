import { getDatabase } from "../mongodb";
import { ObjectId } from "mongodb";
export interface Project {
	_id?: string;
	title: string;
	description: string;
	category: string;
	participants: string;
	duration: string;
	icon: string;
	color: string;
	image?: string;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface Event {
	_id?: string;
	title: string;
	date: string;
	time?: string;
	location: string;
	description: string;
	image?: string;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface Partner {
	_id?: string;
	name: string;
	type: string;
	description: string;
	logo: string;
	category: string;
	website?: string;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface ContactMessage {
	_id?: string;
	name: string;
	email: string;
	subject: string;
	message: string;
	status: 'new' | 'read' | 'replied';
	createdAt: Date;
	updatedAt: Date;
}

export interface HeroData {
	_id?: string;
	mainTitle: string;
	highlightedText: string;
	subtitle: string;
	primaryButtonText: string;
	secondaryButtonText: string;
	stats: {
		members: {
			value: string;
			label: string;
		};
		projects: {
			value: string;
			label: string;
		};
		volunteerHours: {
			value: string;
			label: string;
		};
	};
	createdAt: Date;
	updatedAt: Date;
}

export interface AboutData {
	_id?: string;
	title: string;
	description: string;
	mission: {
		title: string;
		description: string;
	};
	values: Array<{
		title: string;
		description: string;
		icon: string;
	}>;
	achievements: {
		title: string;
		description: string;
		stats: Array<{
			value: string;
			label: string;
		}>;
	};
	management: {
		title: string;
		description: string;
		members: Array<{
			name: string;
			position: string;
			description: string;
			image: string;
			experience: string;
			education: string;
		}>;
	};
	carousel: {
		enabled: boolean;
		autoplay: boolean;
		autoplaySpeed: number; // w milisekundach
		images: Array<{
			_id?: string;
			url: string;
			alt: string;
			title?: string;
			description?: string;
			order: number;
		}>;
	};
	createdAt: Date;
	updatedAt: Date;
}

export interface ContactData {
	_id?: string;
	title: string;
	description: string;
	contactInfo: {
		email: string[];
		phone: string[];
		address: string[];
		hours: string[];
	};
	socialMedia: Array<{
		name: string;
		url: string;
		icon: string;
	}>;
	supportLink: {
		title: string;
		url: string;
		description: string;
	};
	createdAt: Date;
	updatedAt: Date;
}

export interface TargetData {
	_id?: string;
	title: string;
	description: string;
	targetGroups: Array<{
		title: string;
		description: string;
		icon: string;
		benefits: string[];
	}>;
	generalBenefits: Array<{
		title: string;
		description: string;
		icon: string;
	}>;
	cta: {
		title: string;
		description: string;
		primaryButton: string;
		secondaryButton: string;
	};
	createdAt: Date;
	updatedAt: Date;
}

export interface Ward {
	_id?: string;
	name: string;
	description: string;
	image?: string;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface FooterData {
	_id?: string;
	organizationName: string;
	description: string;
	quickLinks: Array<{
		text: string;
		href: string;
	}>;
	contact: {
		email: string;
		phone: string;
		address: string;
	};
	socialMedia: Array<{
		name: string;
		url: string;
	}>;
	krs: string;
	copyright: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface NotificationSettings {
	_id?: string | null;
	emailNotifications: {
		enabled: boolean;
		adminEmail: string;
		subject: string;
		template: string;
	};
	createdAt: Date;
	updatedAt: Date;
}

// Projects
export const getProjects = async (): Promise<Project[]> => {
	const db = await getDatabase();
	const projects = db.collection<Project>('projects');
	const result = await projects.find({ isActive: true }).sort({ createdAt: -1 }).toArray();
	return result.map((project) => ({
		...project,
		_id: project._id?.toString(),
	}));
};

export const getAllProjects = async (): Promise<Project[]> => {
	const db = await getDatabase();
	const projects = db.collection<Project>('projects');
	const result = await projects.find({}).sort({ createdAt: -1 }).toArray();
	return result.map((project) => ({
		...project,
		_id: project._id?.toString(),
	}));
};

export const createProject = async (
	projectData: Omit<Project, '_id' | 'createdAt' | 'updatedAt'>
): Promise<Project> => {
	const db = await getDatabase();
	const projects = db.collection<Project>('projects');

	const newProject: Omit<Project, '_id'> = {
		...projectData,
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	const result = await projects.insertOne(newProject);
	return { ...newProject, _id: result.insertedId?.toString() || "" };
};

export const updateProject = async (
	id: string,
	projectData: Partial<Omit<Project, '_id' | 'createdAt'>>
): Promise<void> => {
	const db = await getDatabase();
	const projects = db.collection<Project>('projects');
	

	// Remove _id from projectData to avoid updating immutable field
	const { _id, ...updateData } = projectData as any;

	await projects.updateOne(
		{ _id: new ObjectId(id) as any },
		{ $set: { ...updateData, updatedAt: new Date() } }
	);
};

export const deleteProject = async (id: string): Promise<void> => {
	const db = await getDatabase();
	const projects = db.collection<Project>('projects');
	
	await projects.updateOne(
		{ _id: new ObjectId(id) as any },
		{ $set: { isActive: false, updatedAt: new Date() } }
	);
};

// Events
export const getEvents = async (): Promise<Event[]> => {
	const db = await getDatabase();
	const events = db.collection<Event>('events');
	const result = await events.find({ isActive: true }).sort({ createdAt: -1 }).toArray();
	return result.map((event) => ({
		...event,
		_id: event._id?.toString(),
	}));
};

export const getAllEvents = async (): Promise<Event[]> => {
	const db = await getDatabase();
	const events = db.collection<Event>('events');
	const result = await events.find({}).sort({ createdAt: -1 }).toArray();
	return result.map((event) => ({
		...event,
		_id: event._id?.toString(),
	}));
};

export const createEvent = async (
	eventData: Omit<Event, '_id' | 'createdAt' | 'updatedAt'>
): Promise<Event> => {
	const db = await getDatabase();
	const events = db.collection<Event>('events');

	const newEvent: Omit<Event, '_id'> = {
		...eventData,
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	const result = await events.insertOne(newEvent);
	return { ...newEvent, _id: result.insertedId?.toString() || "" };
};

export const updateEvent = async (
	id: string,
	eventData: Partial<Omit<Event, '_id' | 'createdAt'>>
): Promise<void> => {
	const db = await getDatabase();
	const events = db.collection<Event>('events');
	

	// Remove _id from eventData to avoid updating immutable field
	const { _id, ...updateData } = eventData as any;

	await events.updateOne(
		{ _id: new ObjectId(id) as any },
		{ $set: { ...updateData, updatedAt: new Date() } }
	);
};

export const deleteEvent = async (id: string): Promise<void> => {
	const db = await getDatabase();
	const events = db.collection<Event>('events');
	
	await events.updateOne(
		{ _id: new ObjectId(id) as any },
		{ $set: { isActive: false, updatedAt: new Date() } }
	);
};

// Partners
export const getPartners = async (): Promise<Partner[]> => {
	const db = await getDatabase();
	const partners = db.collection<Partner>('partners');
	const result = await partners.find({ isActive: true }).sort({ createdAt: -1 }).toArray();
	return result.map((partner) => ({
		...partner,
		_id: partner._id?.toString(),
	}));
};

export const createPartner = async (
	partnerData: Omit<Partner, '_id' | 'createdAt' | 'updatedAt'>
): Promise<Partner> => {
	const db = await getDatabase();
	const partners = db.collection<Partner>('partners');

	const newPartner: Omit<Partner, '_id'> = {
		...partnerData,
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	const result = await partners.insertOne(newPartner);
	return { ...newPartner, _id: result.insertedId?.toString() || "" };
};

export const updatePartner = async (
	id: string,
	partnerData: Partial<Omit<Partner, '_id' | 'createdAt'>>
): Promise<void> => {
	const db = await getDatabase();
	const partners = db.collection<Partner>('partners');
	

	// Remove _id from partnerData to avoid updating immutable field
	const { _id, ...updateData } = partnerData as any;

	await partners.updateOne(
		{ _id: new ObjectId(id) as any },
		{ $set: { ...updateData, updatedAt: new Date() } }
	);
};

export const deletePartner = async (id: string): Promise<void> => {
	const db = await getDatabase();
	const partners = db.collection<Partner>('partners');
	
	await partners.updateOne(
		{ _id: new ObjectId(id) as any },
		{ $set: { isActive: false, updatedAt: new Date() } }
	);
};

// Contact Messages
export const getContactMessages = async (): Promise<ContactMessage[]> => {
	const db = await getDatabase();
	const messages = db.collection<ContactMessage>('contact_messages');
	const result = await messages.find().sort({ createdAt: -1 }).toArray();
	return result.map((message) => ({
		...message,
		_id: message._id?.toString(),
	}));
};

export const createContactMessage = async (
	messageData: Omit<ContactMessage, '_id' | 'createdAt' | 'updatedAt'>
): Promise<ContactMessage> => {
	const db = await getDatabase();
	const messages = db.collection<ContactMessage>('contact_messages');

	const newMessage: Omit<ContactMessage, '_id'> = {
		...messageData,
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	const result = await messages.insertOne(newMessage);
	return { ...newMessage, _id: result.insertedId?.toString() || "" };
};

export const updateContactMessage = async (
	id: string,
	messageData: Partial<Omit<ContactMessage, '_id' | 'createdAt'>>
): Promise<void> => {
	const db = await getDatabase();
	const messages = db.collection<ContactMessage>('contact_messages');
	

	// Remove _id from messageData to avoid updating immutable field
	const { _id, ...updateData } = messageData as any;

	await messages.updateOne(
		{ _id: new ObjectId(id) as any },
		{ $set: { ...updateData, updatedAt: new Date() } }
	);
};

export const deleteContactMessage = async (id: string): Promise<void> => {
	const db = await getDatabase();
	const messages = db.collection<ContactMessage>('contact_messages');
	
	await messages.deleteOne({ _id: new ObjectId(id) as any });
};

// Hero Data
export const getHeroData = async (): Promise<HeroData | null> => {
	const db = await getDatabase();
	const heroData = db.collection<HeroData>('hero_data');
	const result = await heroData.findOne({});
	return result
		? {
				...result,
				_id: result._id?.toString(),
		  }
		: null;
};

export const createHeroData = async (
	heroData: Omit<HeroData, '_id' | 'createdAt' | 'updatedAt'>
): Promise<HeroData> => {
	const db = await getDatabase();
	const heroCollection = db.collection<HeroData>('hero_data');

	const newHeroData: Omit<HeroData, '_id'> = {
		...heroData,
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	const result = await heroCollection.insertOne(newHeroData);
	return { ...newHeroData, _id: result.insertedId?.toString() || "" };
};

export const updateHeroData = async (
	id: string,
	heroData: Partial<Omit<HeroData, '_id' | 'createdAt'>>
): Promise<void> => {
	const db = await getDatabase();
	const heroCollection = db.collection<HeroData>('hero_data');
	

	// Remove _id from heroData to avoid updating immutable field
	const { _id, ...updateData } = heroData as any;

	await heroCollection.updateOne(
		{ _id: new ObjectId(id) as any },
		{ $set: { ...updateData, updatedAt: new Date() } }
	);
};

// About Data
export const getAboutData = async (): Promise<AboutData | null> => {
	const db = await getDatabase();
	const aboutData = db.collection<AboutData>('about_data');
	const result = await aboutData.findOne({});
	return result
		? {
				...result,
				_id: result._id?.toString(),
		  }
		: null;
};

export const createAboutData = async (
	aboutData: Omit<AboutData, '_id' | 'createdAt' | 'updatedAt'>
): Promise<AboutData> => {
	const db = await getDatabase();
	const aboutCollection = db.collection<AboutData>('about_data');

	const newAboutData: Omit<AboutData, '_id'> = {
		...aboutData,
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	const result = await aboutCollection.insertOne(newAboutData);
	return { ...newAboutData, _id: result.insertedId?.toString() || "" };
};

export const updateAboutData = async (
	id: string,
	aboutData: Partial<Omit<AboutData, '_id' | 'createdAt'>>
): Promise<void> => {
	const db = await getDatabase();
	const aboutCollection = db.collection<AboutData>('about_data');
	

	// Remove _id from aboutData to avoid updating immutable field
	const { _id, ...updateData } = aboutData as any;

	await aboutCollection.updateOne(
		{ _id: new ObjectId(id) as any },
		{ $set: { ...updateData, updatedAt: new Date() } }
	);
};

// Contact Data
export const getContactData = async (): Promise<ContactData | null> => {
	const db = await getDatabase();
	const contactData = db.collection<ContactData>('contact_data');
	const result = await contactData.findOne({});
	return result
		? {
				...result,
				_id: result._id?.toString(),
		  }
		: null;
};

export const createContactData = async (
	contactData: Omit<ContactData, '_id' | 'createdAt' | 'updatedAt'>
): Promise<ContactData> => {
	const db = await getDatabase();
	const contactCollection = db.collection<ContactData>('contact_data');

	const newContactData: Omit<ContactData, '_id'> = {
		...contactData,
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	const result = await contactCollection.insertOne(newContactData);
	return { ...newContactData, _id: result.insertedId?.toString() || "" };
};

export const updateContactData = async (
	id: string,
	contactData: Partial<Omit<ContactData, '_id' | 'createdAt'>>
): Promise<void> => {
	const db = await getDatabase();
	const contactCollection = db.collection<ContactData>('contact_data');
	

	// Remove _id from contactData to avoid updating immutable field
	const { _id, ...updateData } = contactData as any;

	await contactCollection.updateOne(
		{ _id: new ObjectId(id) as any },
		{ $set: { ...updateData, updatedAt: new Date() } }
	);
};

// Target Data
export const getTargetData = async (): Promise<TargetData | null> => {
	const db = await getDatabase();
	const targetData = db.collection<TargetData>('target_data');
	const result = await targetData.findOne({});
	return result
		? {
				...result,
				_id: result._id?.toString(),
		  }
		: null;
};

export const createTargetData = async (
	targetData: Omit<TargetData, '_id' | 'createdAt' | 'updatedAt'>
): Promise<TargetData> => {
	const db = await getDatabase();
	const targetCollection = db.collection<TargetData>('target_data');

	const newTargetData: Omit<TargetData, '_id'> = {
		...targetData,
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	const result = await targetCollection.insertOne(newTargetData);
	return { ...newTargetData, _id: result.insertedId?.toString() || "" };
};

export const updateTargetData = async (
	id: string,
	targetData: Partial<Omit<TargetData, '_id' | 'createdAt'>>
): Promise<void> => {
	const db = await getDatabase();
	const targetCollection = db.collection<TargetData>('target_data');
	

	// Remove _id from targetData to avoid updating immutable field
	const { _id, ...updateData } = targetData as any;

	await targetCollection.updateOne(
		{ _id: new ObjectId(id) as any },
		{ $set: { ...updateData, updatedAt: new Date() } }
	);
};

// Footer Data
export const getFooterData = async (): Promise<FooterData | null> => {
	const db = await getDatabase();
	const footerData = db.collection<FooterData>('footer_data');
	const result = await footerData.findOne({});
	return result
		? {
				...result,
				_id: result._id?.toString(),
		  }
		: null;
};

export const createFooterData = async (
	footerData: Omit<FooterData, '_id' | 'createdAt' | 'updatedAt'>
): Promise<FooterData> => {
	const db = await getDatabase();
	const footerCollection = db.collection<FooterData>('footer_data');

	const newFooterData: Omit<FooterData, '_id'> = {
		...footerData,
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	const result = await footerCollection.insertOne(newFooterData);
	return { ...newFooterData, _id: result.insertedId?.toString() || "" };
};

export const updateFooterData = async (
	id: string,
	footerData: Partial<Omit<FooterData, '_id' | 'createdAt'>>
): Promise<void> => {
	const db = await getDatabase();
	const footerCollection = db.collection<FooterData>('footer_data');
	

	// Remove _id from footerData to avoid updating immutable field
	const { _id, ...updateData } = footerData as any;

	await footerCollection.updateOne(
		{ _id: new ObjectId(id) as any },
		{ $set: { ...updateData, updatedAt: new Date() } }
	);
};

// Wards (Podopieczni)
export const getWards = async (): Promise<Ward[]> => {
	const db = await getDatabase();
	const wards = db.collection<Ward>('wards');
	const result = await wards.find({ isActive: true }).sort({ createdAt: -1 }).toArray();
	return result.map((ward) => ({
		...ward,
		_id: ward._id?.toString(),
	}));
};

export const getAllWards = async (): Promise<Ward[]> => {
	const db = await getDatabase();
	const wards = db.collection<Ward>('wards');
	const result = await wards.find({}).sort({ createdAt: -1 }).toArray();
	return result.map((ward) => ({
		...ward,
		_id: ward._id?.toString(),
	}));
};

export const createWard = async (
	wardData: Omit<Ward, '_id' | 'createdAt' | 'updatedAt'>
): Promise<Ward> => {
	const db = await getDatabase();
	const wards = db.collection<Ward>('wards');

	const newWard: Omit<Ward, '_id'> = {
		...wardData,
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	const result = await wards.insertOne(newWard);
	return { ...newWard, _id: result.insertedId?.toString() || "" };
};

export const updateWard = async (
	id: string,
	wardData: Partial<Omit<Ward, '_id' | 'createdAt'>>
): Promise<void> => {
	const db = await getDatabase();
	const wards = db.collection<Ward>('wards');
	

	// Remove _id from wardData to avoid updating immutable field
	const { _id, ...updateData } = wardData as any;

	await wards.updateOne(
		{ _id: new ObjectId(id) as any },
		{ $set: { ...updateData, updatedAt: new Date() } }
	);
};

export const deleteWard = async (id: string): Promise<void> => {
	const db = await getDatabase();
	const wards = db.collection<Ward>('wards');
	
	await wards.updateOne(
		{ _id: new ObjectId(id) as any },
		{ $set: { isActive: false, updatedAt: new Date() } }
	);
};

// Notification Settings
export const getNotificationSettings = async (): Promise<NotificationSettings | null> => {
	const db = await getDatabase();
	const settings = db.collection<NotificationSettings>('notification_settings');
	const result = await settings.findOne({});
	return result
		? {
				...result,
				_id: result._id?.toString(),
		  }
		: null;
};

export const createNotificationSettings = async (
	settingsData: Omit<NotificationSettings, '_id' | 'createdAt' | 'updatedAt'>
): Promise<NotificationSettings> => {
	const db = await getDatabase();
	const settingsCollection = db.collection<NotificationSettings>('notification_settings');

	// Remove _id if it's null or empty
	const { _id, ...cleanSettingsData } = settingsData as any;

	const newSettings: Omit<NotificationSettings, '_id'> = {
		...cleanSettingsData,
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	const result = await settingsCollection.insertOne(newSettings);
	return { ...newSettings, _id: result.insertedId?.toString() || "" };
};

export const updateNotificationSettings = async (
	id: string,
	settingsData: Partial<Omit<NotificationSettings, '_id' | 'createdAt'>>
): Promise<void> => {
	const db = await getDatabase();
	const settingsCollection = db.collection<NotificationSettings>('notification_settings');
	

	// Remove _id from settingsData to avoid updating immutable field
	const { _id, ...updateData } = settingsData as any;

	await settingsCollection.updateOne(
		{ _id: new ObjectId(id) as any },
		{ $set: { ...updateData, updatedAt: new Date() } }
	);
};
