import { getDatabase, onValue, ref } from "firebase/database";

function getData(query) {
  const db = getDatabase();
  const dbMessage = ref(db, query);
  let data = [];
  onValue(dbMessage, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const messageData = childSnapshot.val();
      data.push(messageData);
    });
  });
  return data;
}
export default getData;
