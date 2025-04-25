import { useEffect, useRef, useState, useCallback } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { auth } from '../../firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../utils/cropImage';
import { Area } from 'react-easy-crop/types';

export default function FotoPage() {
  const [userEmail, setUserEmail] = useState('');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user?.email) setUserEmail(user.email);
    });
  }, []);

  const onCropComplete = useCallback((_: any, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImageSrc(reader.result as string);
    };
  };

  const uploadCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels || !userEmail) {
      alert('Erro: dados insuficientes para upload.');
      return;
    }

    try {
      setIsSaving(true);
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const storage = getStorage();
      const fileRef = ref(storage, `fotos-perfil/${userEmail}.jpg`);
      await uploadBytes(fileRef, blob);
      const downloadURL = await getDownloadURL(fileRef);
      alert('Foto enviada com sucesso!');
      console.log('URL da imagem:', downloadURL);
    } catch (err) {
      console.error('Erro ao enviar imagem:', err);
      alert('Erro ao salvar imagem.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Upload de Foto com Recorte 3x4</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {imageSrc && (
        <div style={{ position: 'relative', width: '300px', height: '400px', marginTop: '1rem' }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={3 / 4}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
      )}
      {imageSrc && (
        <button onClick={uploadCroppedImage} style={{ marginTop: '1rem' }} disabled={isSaving}>
          {isSaving ? 'Salvando...' : 'Salvar Foto'}
        </button>
      )}
    </div>
  );
}
