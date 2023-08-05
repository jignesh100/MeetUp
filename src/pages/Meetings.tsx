import React, { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth';
import { useAppSelector } from '../app/hooks';
import { MeetingType } from '../utils/Types';
import { getDocs, query } from 'firebase/firestore';
import { meetingsRef } from '../utils/FirebaseConfig';
import moment from 'moment';
import * as eui from '@elastic/eui';
import { Link } from 'react-router-dom';
import Header from '../components/Header';


export default function Meeting() {
    useAuth();
    const userInfo = useAppSelector((zoom) => zoom.auth.userInfo);
    const [meetings, setMeetings] = useState<Array<MeetingType>>([]);
  
    useEffect(() => {
      const getMyMeetings = async () => {
        const firestoreQuery = query(meetingsRef);
        const fetchedMeetings = await getDocs(firestoreQuery);
        if (fetchedMeetings.docs.length) {
          const myMeetings: Array<MeetingType> = [];
          fetchedMeetings.forEach((meeting) => {
            const data = meeting.data() as MeetingType;
            if (data.createdBy === userInfo?.uid)
              myMeetings.push(meeting.data() as MeetingType);
            else if (data.meetingType === "anyone-can-join")
              myMeetings.push(meeting.data() as MeetingType);
            else {
              const index = data.invitedUsers.findIndex(
                (user: string) => user === userInfo?.uid
              );
              if (index !== -1) {
                myMeetings.push(meeting.data() as MeetingType);
              }
            }
          });
  
          setMeetings(myMeetings);
        }
      };
      if (userInfo) getMyMeetings();
    }, [userInfo]);
  
    const meetingColumns = [
      {
        field: "meetingName",
        name: "Meeting Name",
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
                <eui.EuiBadge color="success">
                  <Link
                    to={`/join/${meeting.meetingId}`}
                    style={{ color: "black" }}
                  >
                    Join Now
                  </Link>
                </eui.EuiBadge>
              );
            } else if (
              moment(meeting.meetingDate).isBefore(moment().format("L"))
            ) {
              return <eui.EuiBadge color="default">Ended</eui.EuiBadge>;
            } else if (moment(meeting.meetingDate).isAfter()) {
              return <eui.EuiBadge color="primary">Upcoming</eui.EuiBadge>;
            }
          } else return <eui.EuiBadge color="danger">Cancelled</eui.EuiBadge>;
        },
      },
      {
        field: "meetingId",
        name: "Copy Link",
        width: "10%",
        render: (meetingId: string) => {
          return (
            <eui.EuiCopy
              textToCopy={`${process.env.REACT_APP_HOST}/join/${meetingId}`}
            >
              {(copy: any) => (
                <eui.EuiButtonIcon
                  iconType="copy"
                  onClick={copy}
                  display="base"
                  aria-label="meeting-copy"
                />
              )}
            </eui.EuiCopy>
          );
        },
      },
    ];
  
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <Header />
        <eui.EuiFlexGroup justifyContent="center" style={{ margin: "1rem" }}>
          <eui.EuiFlexItem>
            <eui.EuiPanel>
              <eui.EuiBasicTable items={meetings} columns={meetingColumns} />
            </eui.EuiPanel>
          </eui.EuiFlexItem>
        </eui.EuiFlexGroup>
      </div>
    );
  }




