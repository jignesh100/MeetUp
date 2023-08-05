import React, { useEffect, useState } from 'react'
import { FieldErrorType, MeetingType, UserType } from '../utils/Types';
import useAuth from '../hooks/useAuth';
import useFetchUsers from '../hooks/useFetchUsers';
import useToast from '../hooks/useToast';
import { useAppSelector } from '../app/hooks';
import moment from 'moment';
import { firebaseDB } from '../utils/FirebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { EuiFlyout, EuiFlyoutBody, EuiFlyoutHeader, EuiForm, EuiFormRow, EuiSpacer, EuiSwitch, EuiTitle } from '@elastic/eui';
import MeetingNameField from './FromCompoents/MeetingNameField';
import MeetingMaximumUsersField from './FromCompoents/MeetingMaximumUsersField';
import MeetingUserField from './FromCompoents/MeetingUserField';
import MeetingDateField from './FromCompoents/MeetingDateField';
import CreateMeetingButtons from './FromCompoents/CreateMeetingButtons';
import { STATUS } from '@elastic/eui/src/components/steps/step_number';

export default function EditFlyout({
    closeFlyout,
    meetings,
}: {
    closeFlyout: any;
    meetings: MeetingType;
}) {
    const [users] = useFetchUsers();
    const [createToast] = useToast();
    const [meetingName, setMeetingName] = useState(meetings.meetingName);
    const [meetingType] = useState(meetings.meetingType);
    const [selectedUser, setSelectedUser] = useState<Array<UserType>>([]);
    const [startDate, setStartDate] = useState(moment(meetings.meetingDate));
    const [size, setSize] = useState(1);
    const [status, setStatus] = useState(false);
    const onUserChange = (selectedOptions: Array<UserType>) => {
        setSelectedUser(selectedOptions);
    };

    useEffect(() => {
        if (users) {
            const foundUsers: Array<UserType> = [];
            meetings.invitedUsers.forEach((user: string) => {
                const findUser = users.find(
                    (tempUser: UserType) => tempUser.uid === user
                );
                if (findUser) foundUsers.push(findUser);
            });
            setSelectedUser(foundUsers);
        }
    }, [users, meetings]);

    const [showErrors] = useState<{
        meetingName: FieldErrorType;
        meetingUsers: FieldErrorType;
    }>({
        meetingName: {
            show: false,
            message: [],
        },
        meetingUsers: {
            show: false,
            message: [],
        },
    });

    const editMeeting = async () => {
        const editedMeeting = {
            ...meetings,
            meetingName,
            meetingType,
            invitedUsers: selectedUser.map((user: UserType) => user.uid),
            maxUsers: size,
            meetingDate: startDate.format("L"),
            status: !status,
        };
        delete editedMeeting.docId;
        const docRef = doc(firebaseDB, "meetings", meetings.docId!);
        await updateDoc(docRef, editedMeeting);
        createToast({ title: "Meeting updated successfully.", type: "success" });
        closeFlyout(true);
    };

    return (
        <EuiFlyout ownFocus onClose={() => closeFlyout()}>
            <EuiFlyoutHeader hasBorder>
                <EuiTitle size="m">
                    <h2>{meetings.meetingName}</h2>
                </EuiTitle>
            </EuiFlyoutHeader>
            <EuiFlyoutBody>
                <EuiForm>
                    <MeetingNameField
                        label="Meeting name"
                        isInvalid={showErrors.meetingName.show}
                        error={showErrors.meetingName.message}
                        placeholder="Meeting name"
                        value={meetingName}
                        setMeetingName={setMeetingName}
                    />
                    {meetingType === "anyone-can-join" ? (
                        <MeetingMaximumUsersField value={size} setValue={setSize} />
                    ) : (
                        <MeetingUserField
                            label="Invite Users"
                            isInvalid={showErrors.meetingUsers.show}
                            error={showErrors.meetingUsers.message}
                            options={users}
                            onChange={onUserChange}
                            selectedOptions={selectedUser}
                            singleSelection={
                                meetingType === "1-on-1" ? { asPlainText: true } : false
                            }
                            isClearable={false}
                            placeholder="Select a Users"
                        />
                    )}
                    <MeetingDateField selected={startDate} setStartDate={setStartDate} />
                    <EuiFormRow display="columnCompressedSwitch" label="Cancel Meeting">
                        <EuiSwitch
                            showLabel={false}
                            label="Cancel Meeting"
                            checked={status}
                            onChange={(e) => setStatus(e.target.checked)}
                        />
                    </EuiFormRow>
                    <EuiSpacer />
                    <CreateMeetingButtons
                        createMeeting={editMeeting}
                        isEdit
                        closeFlyout={closeFlyout}
                    />
                </EuiForm>
            </EuiFlyoutBody>
        </EuiFlyout>
    );
}