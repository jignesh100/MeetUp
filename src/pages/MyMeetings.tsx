import { useEffect, useState } from 'react'
import { MeetingType } from '../utils/Types'
import useAuth from '../hooks/useAuth';
import { useAppSelector } from '../app/hooks';
import { getDocs, query, where } from 'firebase/firestore';
import { meetingsRef } from '../utils/FirebaseConfig';
import Header from '../components/Header';
import { EuiBadge, EuiBasicTable, EuiButtonIcon, EuiCopy, EuiFlexGroup, EuiFlexItem, EuiPanel, ICON_TYPES } from '@elastic/eui';
import { Link } from 'react-router-dom';
import moment from 'moment';
import EditFlyout from '../components/EditFlyout';

function MyMeetings() {
    useAuth();
    const userInfo = useAppSelector((zoom) => zoom.auth.userInfo);
    const [meetings, setMeetings] = useState<any>([]);
    const getMyMeetings = async () => {
        const firestoreQuery = query(
            meetingsRef,
            where("createdBy", "==", userInfo?.uid)
        );
        const fetchedMeetings = await getDocs(firestoreQuery);
        if (fetchedMeetings.docs.length) {
            const myMeetings: Array<MeetingType> = [];
            fetchedMeetings.forEach((meeting) => {
                myMeetings.push({
                    docId: meeting.id,
                    ...(meeting.data() as MeetingType),
                });
            });
            setMeetings(myMeetings);
        }
    };

    useEffect(() => {
        console.log({ meetings });
        getMyMeetings();

    }, [userInfo]);


    const [showEditFlyout, setShowEditFlyout] = useState(false);
    const [editMeeting, setEditMeeting] = useState<MeetingType>();

    const openEditFlyout = (meeting: MeetingType) => {
        setShowEditFlyout(true);
        setEditMeeting(meeting);
    }
    const closeEditFlyout = (dataChanged = false) => {
        setShowEditFlyout(false);
        setEditMeeting(undefined);
        if (dataChanged) getMyMeetings();
    }


    const columns = [
        {
            field: "meetingName",
            name: 'Meeting Name',
        },
        {
            field: "meetingType",
            name: "Meeting Type",
        },
        {
            field: "meetingDate",
            name: "Meeting Date",
        },
        {
            field: "",
            name: "Status",
            render: (meeting: MeetingType) => {
                if (meeting.status) {
                    if (meeting.meetingDate === moment().format("L")) {
                        return (
                            <EuiBadge color="success">
                                <Link
                                    to={`/join/${meeting.meetingId}`}
                                    style={{ color: "black" }}
                                >
                                    Join Now
                                </Link>
                            </EuiBadge>
                        );
                    } else if (
                        moment(meeting.meetingDate).isBefore(moment().format("L"))
                    ) {
                        return <EuiBadge color="default">Ended</EuiBadge>;
                    } else if (moment(meeting.meetingDate).isAfter()) {
                        return <EuiBadge color="primary">Upcoming</EuiBadge>;
                    }
                } else return <EuiBadge color="danger">Cancelled</EuiBadge>;
            },
        },
        {
            field: "",
            name: "Edit",
            render: (meeting: MeetingType) => {
                return (

                    <EuiButtonIcon
                        aria-label='meeting-edit'
                        iconType="indexEdit"
                        color='danger'
                        display='base'
                        isDisabled={!meeting.status || moment(meeting.meetingDate).isBefore(moment().format("L"))}
                        onClick={() => {

                            openEditFlyout(meeting);
                        }}
                    />
                )
            }
        },
        {
            field: "meetingId",
            name: "Copy Link",
            render: (meetingId: string) => {
                return (
                    <EuiCopy
                        textToCopy={`${process.env.REACT_APP_HOST}/join/${meetingId}`}
                    >
                        {(copy: any) => (
                            <EuiButtonIcon
                                iconType="copy"
                                onClick={copy}
                                display="base"
                                aria-label="meeting-copy"
                            />
                        )}
                    </EuiCopy>
                );
            },
        },
    ];


    return (<div
        style={{
            display: "flex",
            height: "100vh",
            flexDirection: "column",
        }}>
        <Header />
        <EuiFlexGroup justifyContent='center' style={{ margin: "1rem" }}>
            <EuiFlexItem>
                <EuiPanel>
                    <EuiBasicTable
                        items={meetings}
                        columns={columns}
                    />
                </EuiPanel>
            </EuiFlexItem>
        </EuiFlexGroup>

        {showEditFlyout && (
            <EditFlyout closeFlyout={closeEditFlyout} meetings={editMeeting!} />
        )}



    </div>
    )
}

export default MyMeetings