import { EuiButton, EuiFlexGroup, EuiFlexItem, EuiImage, EuiPanel, EuiProvider, EuiSpacer, EuiText, EuiTextColor } from '@elastic/eui'
import animation from "../assets/animation.gif";
import logo from "../assets/logo.png"
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { firebaseAuth, userRef } from '../utils/FirebaseConfig';
import { addDoc, getDocs, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { setUser } from '../app/slices/authslice';


function Login() {

  onAuthStateChanged(firebaseAuth, (currentuser) => {
    if (currentuser) navigate("/")
  })



  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const login = async () => {
    const provider = new GoogleAuthProvider();
    const {
      user: { displayName, email, uid },

    } = await signInWithPopup(firebaseAuth, provider);
    if (email) {
      const firestoreQuery = query(userRef, where("uid", "==", uid));
      const fatchedUsers = await getDocs(firestoreQuery);
      if (fatchedUsers.docs.length === 0) {
        await addDoc(userRef, {
          uid,
          name: displayName,
          email,
        });
      }
    }
    dispatch(setUser({ uid, email: email!, name: displayName! }));
    navigate("/");
  };




  return (

    <EuiProvider colorMode='dark' >
      <div
       style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      
      >
      <EuiFlexGroup alignItems='center' justifyContent='center' style={{ width: "100vw", height: "100vw" }}>
        <EuiFlexItem grow={false}>
          <EuiPanel paddingSize='xl'>
            <EuiFlexGroup justifyContent='center' alignItems='center'>

              <EuiFlexItem>
                <EuiImage alt="logo" src={animation} />
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiImage alt="logo" src={logo} size="230px" />
                <EuiSpacer size='xs' />
                <EuiText textAlign='center' grow={false}>
                  <h3>
                    <EuiTextColor>One Platefrom To </EuiTextColor>
                    <EuiTextColor color='#0b5cff'> Connect</EuiTextColor>
                  </h3>
                </EuiText>
                <EuiSpacer size='l' />
                <EuiButton fill onClick={login}>Login with Gooogle </EuiButton>
              </EuiFlexItem>

            </EuiFlexGroup>
          </EuiPanel>
        </EuiFlexItem>

      </EuiFlexGroup>
      </div>
    </EuiProvider>
    

  )
}

export default Login