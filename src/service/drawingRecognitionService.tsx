import * as tf from '@tensorflow/tfjs';

const CLASS_NAMES = [
   'Maison',  'Rond', 'Arbre',  'Carré', 'Soleil'
];

class DrawingRecognitionService {
  private model: tf.LayersModel | null = null;
  private isLoading = false;
  private loadQueue: Promise<void> | null = null;

  async loadModel() {
    if (this.model) return;
    if (this.isLoading) return this.loadQueue;
    
    this.isLoading = true;
    this.loadQueue = (async () => {
      try {
        // Remplacer par l'URL du modèle exporté de Teachable Machine
        this.model = await tf.loadLayersModel(
          'https://teachablemachine.withgoogle.com/models/dxL95EUqX/model.json'
        );
        console.log('Model loaded successfully');
      } catch (error) {
        console.error('Failed to load model:', error);
        throw new Error('Failed to load AI model');
      } finally {
        this.isLoading = false;
      }
    })();
    
    return this.loadQueue;
  }

  async recognizeDrawing(imageData: string): Promise<string> {
    await this.loadModel();
    if (!this.model) throw new Error('Model not loaded');

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = async () => {
        const tensor = tf.browser.fromPixels(img)
          .resizeNearestNeighbor([224, 224])
          .toFloat()
          .expandDims()
          .div(255.0);

        const predictions = this.model!.predict(tensor) as tf.Tensor;
        const data = await predictions.data();
        const topIndex = data.indexOf(Math.max(...data)) % CLASS_NAMES.length;

        tf.dispose([tensor, predictions]);
        resolve(CLASS_NAMES[topIndex]);
      };
      img.src = imageData;
    });
  }
}

export default new DrawingRecognitionService();
