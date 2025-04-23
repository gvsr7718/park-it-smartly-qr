
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { malls, bookings, Booking } from '@/utils/mockData';
import { isAdmin, isAuthenticated } from '@/utils/auth';
import { assignParkingSlot } from '@/utils/qrGenerator';
import { QrCode, Ticket, Camera, Upload } from 'lucide-react';

const ScanQR = () => {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [scanner, setScanner] = useState<Html5Qrcode | null>(null);
  const [scannedData, setScannedData] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  
  // Check authentication
  if (!isAuthenticated()) {
    navigate('/login');
    return null;
  }
  
  // Only admins should access this page
  if (!isAdmin()) {
    navigate('/user-dashboard');
    return null;
  }
  
  // Start QR scanning
  const startScanner = () => {
    const html5QrCode = new Html5Qrcode("qr-reader");
    setScanner(html5QrCode);
    
    const qrboxFunction = (viewfinderWidth: number, viewfinderHeight: number) => {
      const minEdgePercentage = 0.7; // 70%
      const minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
      const qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
      return {
        width: qrboxSize,
        height: qrboxSize
      };
    };
    
    const config = { fps: 10, qrbox: qrboxFunction };
    
    html5QrCode.start(
      { facingMode: "environment" },
      config,
      onScanSuccess,
      onScanFailure
    ).then(() => {
      setScanning(true);
      toast.info("QR scanner started");
    }).catch(err => {
      toast.error("Unable to start scanner: " + err);
    });
  };

  // Stop QR scanning
  const stopScanner = () => {
    if (scanner && scanning) {
      scanner.stop().then(() => {
        toast.info("QR scanner stopped");
        setScanning(false);
      }).catch(err => {
        toast.error("Error stopping scanner: " + err);
      });
    }
  };

  // Handle successful scan
  const onScanSuccess = (decodedText: string) => {
    stopScanner();
    
    try {
      const qrData = JSON.parse(decodedText);
      setScannedData(qrData);
      toast.success("QR code scanned successfully!");
    } catch (error) {
      toast.error("Invalid QR code format");
      setScannedData(null);
    }
  };

  // Handle scan errors
  const onScanFailure = (error: any) => {
    // Only show persistent errors, not the regular scan failures
    if (error?.name !== "NotFoundException") {
      toast.error(`QR scan error: ${error}`);
    }
  };

  // Process the scanned QR code to assign a slot
  const processQrCode = () => {
    if (!scannedData) return;
    
    setProcessing(true);
    
    // Find booking in our system based on booking ID
    const booking = bookings.find(b => b.id === scannedData.bookingId);
    
    if (!booking) {
      toast.error("Booking not found in system");
      setProcessing(false);
      return;
    }
    
    // Verify booking is valid for today
    const today = new Date().toISOString().split('T')[0];
    if (booking.date !== today) {
      toast.error("This booking is not for today");
      setProcessing(false);
      return;
    }
    
    try {
      // Assign a parking slot
      const updatedBooking = assignParkingSlot(booking);
      
      if (updatedBooking) {
        toast.success(`Slot #${updatedBooking.slotNumber} assigned successfully!`);
        
        // In a real app, this would update the database
        setTimeout(() => {
          setProcessing(false);
          setScannedData(null);
        }, 2000);
      } else {
        toast.error("No available slots at this mall");
        setProcessing(false);
      }
    } catch (error) {
      toast.error("Error assigning parking slot");
      setProcessing(false);
    }
  };
  
  // Reset scanner
  const resetScanner = () => {
    setScannedData(null);
    setProcessing(false);
  };
  
  // Upload QR code image
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (scanner) {
        scanner.scanFile(file, true)
          .then(decodedText => {
            try {
              const qrData = JSON.parse(decodedText);
              setScannedData(qrData);
              toast.success("QR code scanned successfully from image!");
            } catch (error) {
              toast.error("Invalid QR code format in uploaded image");
            }
          })
          .catch(error => {
            toast.error("Error scanning uploaded QR code: " + error);
          });
      } else {
        const html5QrCode = new Html5Qrcode("qr-reader");
        setScanner(html5QrCode);
        
        html5QrCode.scanFile(file, true)
          .then(decodedText => {
            try {
              const qrData = JSON.parse(decodedText);
              setScannedData(qrData);
              toast.success("QR code scanned successfully from image!");
            } catch (error) {
              toast.error("Invalid QR code format in uploaded image");
            }
          })
          .catch(error => {
            toast.error("Error scanning uploaded QR code: " + error);
          });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-parkingDark flex items-center">
            <QrCode className="mr-2 text-parkingPrimary" />
            QR Code Scanner
          </h1>
          <p className="text-parkingNeutral mt-2">Scan parking QR codes to assign slots to users</p>
        </header>
        
        <Tabs defaultValue="scan" className="mb-8">
          <TabsList className="w-full flex">
            <TabsTrigger value="scan" className="flex-1">
              <Camera className="mr-2 h-4 w-4" />
              Scan QR
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex-1">
              <Upload className="mr-2 h-4 w-4" />
              Upload QR
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="scan" className="pt-6">
            <Card>
              <CardContent className="p-6">
                {!scannedData ? (
                  <>
                    <div 
                      id="qr-reader" 
                      className="w-full max-w-sm mx-auto aspect-square border border-dashed border-parkingPrimary rounded-lg mb-6"
                    ></div>
                    
                    {!scanning ? (
                      <Button 
                        onClick={startScanner} 
                        className="w-full bg-parkingPrimary hover:bg-parkingSecondary"
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        Start Camera
                      </Button>
                    ) : (
                      <Button 
                        onClick={stopScanner} 
                        variant="outline" 
                        className="w-full"
                      >
                        Stop Camera
                      </Button>
                    )}
                  </>
                ) : (
                  <div className="text-center">
                    <div className="text-green-500 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2">QR Code Scanned Successfully</h3>
                    
                    <div className="bg-gray-50 p-4 rounded-lg text-left mb-6">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-parkingNeutral">Booking ID:</div>
                        <div className="font-medium">{scannedData.bookingId}</div>
                        
                        <div className="text-parkingNeutral">Mall:</div>
                        <div className="font-medium">{scannedData.mallName}</div>
                        
                        <div className="text-parkingNeutral">Date:</div>
                        <div className="font-medium">{scannedData.date}</div>
                        
                        <div className="text-parkingNeutral">Time:</div>
                        <div className="font-medium">{scannedData.startTime} - {scannedData.endTime}</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <Button 
                        onClick={resetScanner} 
                        variant="outline" 
                        className="flex-1"
                        disabled={processing}
                      >
                        Scan Another
                      </Button>
                      <Button 
                        onClick={processQrCode} 
                        className="flex-1 bg-parkingPrimary hover:bg-parkingSecondary"
                        disabled={processing}
                      >
                        {processing ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          <>
                            <Ticket className="mr-2 h-4 w-4" />
                            Assign Slot
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="upload" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload QR Code Image</CardTitle>
                <CardDescription>Upload an image containing a parking QR code</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-parkingDark
                      file:mr-4 file:py-2 file:px-4 file:rounded-full
                      file:border-0 file:text-sm file:font-medium
                      file:bg-parkingPrimary file:text-white
                      hover:file:bg-parkingSecondary"
                  />
                </div>
                
                <div id="qr-reader" className="hidden"></div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Use the QR Scanner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>1. Click "Start Camera" to activate the QR code scanner.</p>
            <p>2. Point your device camera at a valid parking QR code.</p>
            <p>3. Once scanned, verify the booking details.</p>
            <p>4. Click "Assign Slot" to allocate a parking slot for the user.</p>
            <p>5. Alternatively, you can upload an image of a QR code.</p>
          </CardContent>
          <CardFooter className="bg-gray-50 text-sm text-parkingNeutral">
            <p>Note: Only authorized staff should use this scanner.</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ScanQR;
