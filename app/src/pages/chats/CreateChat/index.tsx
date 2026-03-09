import { useMutation } from '@tanstack/react-query';
import {
	IonCard,
	IonContent,
	IonAvatar,
	IonItem,
	IonLabel,
	IonImg,
	IonButton,
	useIonRouter,
	IonIcon,
	IonText,
} from '@ionic/react';
import { addOutline, chevronForwardOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import { authStore } from '../../../store/auth';
import { createChat } from '../../../services/chat';
import CreateGroup from './CreateGroup';
import SearchUsers from '../../../components/SearchUsers';
import userDefaultAvatar from '../../../assets/user.png';
import './style.css';

interface UsersProps {
	closeModal: any;
	refetch?: any;
}

const CreateChat: React.FC<UsersProps> = ({ closeModal, refetch }) => {
	const { userId } = authStore((store: any) => store);
	const [openGroupModal, setOpenGroupModal] = useState<boolean>(false);
	const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
	const router = useIonRouter();

	const { mutate } = useMutation({
		mutationFn: ({ name, type, avatar, members }: any) => createChat({ name, type, avatar, members }),
	});

	const createPrivateChat = (memberId: string) => {
		mutate(
			{ type: 'private', members: [userId, memberId] },
			{
				onSuccess: (res: any) => {
					router.push(`/chat/${res.chat._id}`, 'forward');
					refetch?.();
					closeModal();
				},
			},
		);
	};

	return (
		<>
			<IonContent className="bg-modern">
				<div className="new-chat-container animate-in">
					<IonButton
						expand="block"
						onClick={() => setOpenGroupModal(true)}
						className="create-group-btn"
						color="primary"
					>
						<IonIcon icon={addOutline} slot="start" />
						Create New Group
					</IonButton>

					<IonText
						color="medium"
						style={{
							fontSize: '12px',
							fontWeight: 'bold',
							textTransform: 'uppercase',
							letterSpacing: '1px',
							marginBottom: '12px',
							display: 'block',
						}}
					>
						Search People
					</IonText>

					<SearchUsers
						type="private"
						onUsersFiltered={(users) => setFilteredUsers(users)}
						placeholder="Search by username..."
					/>

					<div style={{ marginTop: '20px' }}>
						{filteredUsers?.map((user: any) => (
							<React.Fragment key={user._id}>
								{userId !== user._id && (
									<IonCard
										className="user-search-result ion-no-margin"
										onClick={() => createPrivateChat(user._id)}
									>
										<IonItem lines="none" className="user-item">
											<IonAvatar slot="start">
												<IonImg src={user.avatar || userDefaultAvatar} />
											</IonAvatar>
											<IonLabel>
												<h2 style={{ fontWeight: '600' }}>{user.username}</h2>
												<p style={{ fontSize: '12px' }}>Click to start chatting</p>
											</IonLabel>
											<IonIcon icon={chevronForwardOutline} slot="end" color="medium" />
										</IonItem>
									</IonCard>
								)}
							</React.Fragment>
						))}
					</div>
				</div>
			</IonContent>

			<CreateGroup
				closeModal={closeModal}
				setOpenGroupModal={() => setOpenGroupModal(false)}
				openGroupModal={openGroupModal}
			/>
		</>
	);
};

export default CreateChat;
