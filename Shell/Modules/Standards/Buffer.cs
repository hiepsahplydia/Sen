﻿using System.Text;
using Sen.Shell.Modules.Standards.IOModule;
namespace Sen.Shell.Modules.Standards.IOModule.Buffer
{

    public class SenBuffer
    {

        public Stream baseStream;
        public long length { get => baseStream.Length; set => baseStream.SetLength(value); }
        public long writeOffset { get; set; }
        public long readOffset { get; set; }

        public int imageWidth;

        public int imageHeight;
        private byte[]? m_buffer;

        //Constructors
        /// <summary>
        /// Creates a new SenBuffer instance.
        /// <param name="stream"> { Stream } The FileStream of the internal Buffer.</param>
        /// </summary>

        public SenBuffer(Stream stream)
        {
            baseStream = stream;
        }
        public Encoding Encode = Encoding.UTF8;

        /// <summary>
        /// Creates a new empty SenBuffer instance.
        /// </summary>
        public SenBuffer() : this(new MemoryStream())
        {
        }

        /// <summary>
        /// Creates a new  SenBuffer instance.
        /// <param name="bytes"> { Bytes } The Bytes to use as the internal Bytes value.</param>
        /// </summary>
        public SenBuffer(byte[] bytes) : this(new MemoryStream(bytes))
        {
        }

        public SenBuffer(int size)
        {
            byte[] bytes = new byte[size];
            baseStream = new MemoryStream(bytes);
        }

        /// <summary>
        /// Creates a new SenBuffer instance.
        /// <param name="path"> { Path } The Bytes to use as the internal Bytes value.</param>
        /// </summary>


        public SenBuffer(string path)
        {
            byte[] bytes = File.ReadAllBytes(path);
            baseStream = new MemoryStream(bytes);
        }

        /// <summary>
        /// Creates a new SenBuffer apply imagePixels.
        /// <param name="imageData"> { ImageData } The RGBA32[] to apply SenBuffer.</param>
        /// <param name="width"> { Width } The width of the image.</param>
        /// <param name="height"> { Height } The height of the image.</param>
        /// </summary>

        public SenBuffer(Rgba32[] imageData, int width, int height)
        {
            using (var image = Image.LoadPixelData<Rgba32>(imageData, width, height))
            {
                baseStream = new MemoryStream();
                image.SaveAsPng(baseStream);
            }
        }

        public Rgba32[] getImageData()
        {
            Image<Rgba32> image = Image.Load<Rgba32>(baseStream);
            imageWidth = image.Width;
            imageHeight = image.Height;
            Rgba32[] pixelArray = new Rgba32[imageWidth * imageHeight];
            image.CopyPixelDataTo(pixelArray);
            return pixelArray;
        }
        private void fixReadOffset(long offset)
        {
            if (offset != -1 && offset > -1)
            {
                readOffset = offset;
                baseStream.Position = readOffset;
            }
            else if (offset == -1)
            {
                baseStream.Position = readOffset;
            }
            else
            {
                // 
                throw new Exception();
            }

        }

        private void fixWriteOffset(long offset)
        {
            if (offset != -1 && offset > -1)
            {
                writeOffset = offset;
                baseStream.Position = writeOffset;
            }
            else if (offset == -1)
            {
                baseStream.Position = writeOffset;
            }
            else
            {
                //
                throw new Exception();
            }
        }

        public byte[] readBytes(int count, long offset = -1)
        {
            fixReadOffset(offset);
            if (readOffset + count > length) throw new ArgumentException($"Offset is outside the bounds of the DataView");
            byte[] array = new byte[count];
            baseStream.Read(array, 0, count);
            readOffset += count;
            return array;
        }

        public string readString(int count, long offset = -1, string EncodingType = "UTF-8")
        {
            fixReadOffset(offset);
            byte[] array = readBytes(count);
            Encoding encoding = Encoding.GetEncoding(EncodingType);
            return encoding.GetString(array);
        }

        public byte[] getBytes(int count, long offset)
        {
            baseStream.Position = offset;
            if (offset + count > length) throw new ArgumentException($"Offset is outside the bounds of the DataView");
            byte[] array = new byte[count];
            baseStream.Read(array, 0, count);
            baseStream.Position = readOffset;
            return array;
        }

        public byte readUInt8(long offset = -1)
        {
            fixReadOffset(offset);
            m_buffer = readBytes(1);
            return (byte)m_buffer[0];
        }

        public ushort readUInt16LE(long offset = -1)
        {
            fixReadOffset(offset);
            m_buffer = readBytes(2);
            return (ushort)(m_buffer[0] | (m_buffer[1] << 8));
        }

        public ushort readUInt16BE(long offset = -1)
        {
            fixReadOffset(offset);
            m_buffer = readBytes(2);
            return (ushort)(m_buffer[1] | (m_buffer[0] << 8));
        }

        public uint readUInt24LE(long offset = -1)
        {
            fixReadOffset(offset);
            m_buffer = readBytes(3);
            return (uint)(m_buffer[0] | (m_buffer[1] << 8) | (m_buffer[2] << 16));
        }

        public uint readUInt24BE(long offset = -1)
        {
            fixReadOffset(offset);
            m_buffer = readBytes(3);
            return (uint)(m_buffer[2] | (m_buffer[1] << 8) | (m_buffer[0] << 16));
        }

        public uint readUInt32LE(long offset = -1)
        {
            fixReadOffset(offset);
            m_buffer = readBytes(4);
            return (uint)(m_buffer[0] | (m_buffer[1] << 8) | (m_buffer[2] << 16) | (m_buffer[3] << 24));
        }

        public uint readUInt32BE(long offset = -1)
        {
            fixReadOffset(offset);
            m_buffer = readBytes(4);
            return (uint)(m_buffer[3] | (m_buffer[2] << 8) | (m_buffer[1] << 16) | (m_buffer[0] << 24));
        }

        public ulong readBigUInt64LE(long offset = -1)
        {
            fixReadOffset(offset);
            m_buffer = readBytes(8);
            return (((ulong)(uint)(m_buffer[4] | (m_buffer[5] << 8) | (m_buffer[6] << 16) | (m_buffer[7] << 24))) << 32) | ((uint)(m_buffer[0] | (m_buffer[1] << 8) | (m_buffer[2] << 16) | (m_buffer[3] << 24)));
        }

        public ulong readBigUInt64BE(long offset = -1)
        {
            fixReadOffset(offset);
            m_buffer = readBytes(8);
            return (((ulong)(uint)(m_buffer[3] | (m_buffer[2] << 8) | (m_buffer[1] << 16) | (m_buffer[0] << 24))) << 32) | ((uint)(m_buffer[7] | (m_buffer[6] << 8) | (m_buffer[5] << 16) | (m_buffer[4] << 24)));
        }

        public uint readVarUInt32(long offset = -1)
        {
            fixReadOffset(offset);
            return (uint)readVarInt32();
        }

        public ulong readVarUInt64(long offset = -1)
        {
            fixReadOffset(offset);
            return (ulong)readVarUInt64();
        }

        public sbyte readInt8(long offset = -1)
        {
            fixReadOffset(offset);
            m_buffer = readBytes(1);
            return (sbyte)m_buffer[0];
        }

        public short readInt16LE(long offset = -1)
        {
            fixReadOffset(offset);
            m_buffer = readBytes(2);
            return (short)(m_buffer[0] | (m_buffer[1] << 8));
        }

        public int readInt24LE(long offset = -1)
        {
            fixReadOffset(offset);
            uint num = readUInt24LE();
            if ((num & 0x800000) != 0) num |= 0xff000000;
            return (int)num;
        }

        public int readInt24BE(long offset = -1)
        {
            fixReadOffset(offset);
            uint num = readUInt24BE();
            if ((num & 0x800000) != 0) num |= 0xff000000;
            return (int)num;
        }

        public int readInt32LE(long offset = -1)
        {
            fixReadOffset(offset);
            m_buffer = readBytes(4);
            return m_buffer[0] | (m_buffer[1] << 8) | (m_buffer[2] << 16) | (m_buffer[3] << 24);
        }

        public int readInt32BE(long offset = -1)
        {
            fixReadOffset(offset);
            m_buffer = readBytes(4);
            return m_buffer[3] | (m_buffer[2] << 8) | (m_buffer[1] << 16) | (m_buffer[0] << 24);
        }

        public long readBigInt64LE(long offset = -1)
        {
            fixReadOffset(offset);
            m_buffer = readBytes(8);
            return (long)((((ulong)(uint)(m_buffer[4] | (m_buffer[5] << 8) | (m_buffer[6] << 16) | (m_buffer[7] << 24))) << 32) | ((uint)(m_buffer[0] | (m_buffer[1] << 8) | (m_buffer[2] << 16) | (m_buffer[3] << 24))));
        }

        public long readBigInt64BE(long offset = -1)
        {
            fixReadOffset(offset);
            m_buffer = readBytes(8);
            return (long)((((ulong)(uint)(m_buffer[3] | (m_buffer[2] << 8) | (m_buffer[1] << 16) | (m_buffer[0] << 24))) << 32) | ((uint)(m_buffer[7] | (m_buffer[6] << 8) | (m_buffer[5] << 16) | (m_buffer[4] << 24))));
        }

        public int readVarInt32(long offset = -1)
        {
            fixReadOffset(offset);
            int num = 0;
            int num2 = 0;
            byte b;
            do
            {
                if (num2 == 35)
                {
                    throw new Exception();
                }
                b = readUInt8();
                num |= (b & 0x7F) << num2;
                num2 += 7;
                readOffset += 1;
            }
            while ((b & 0x80) != 0);
            return num;
        }

        public long readVarInt64(long offset = -1)
        {
            fixReadOffset(offset);
            long num = 0;
            int num2 = 0;
            byte b;
            do
            {
                if (num2 == 70)
                {
                    throw new Exception();
                }
                b = readUInt8();
                num |= ((long)(b & 0x7F)) << num2;
                num2 += 7;
                readOffset += 1;
            }
            while ((b & 0x80) != 0);
            return num;
        }

        public int readZigZag32(long offset = -1)
        {
            fixReadOffset(offset);
            uint n = (uint)readVarInt32();
            return (((int)(n << 31)) >> 31) ^ ((int)(n >> 1));
        }

        public long readZigZag64(long offset = -1)
        {
            fixReadOffset(offset);
            ulong n = (ulong)readVarInt64();
            return ((long)(n >> 1)) ^ (-(long)(n & 0b1));
        }

        public float readFloatLE(long offset = -1)
        {
            fixReadOffset(offset);
            m_buffer = readBytes(4);
            return BitConverter.ToSingle(m_buffer, 0);
        }

        public float readFloatBE(long offset = -1)
        {
            fixReadOffset(offset);
            m_buffer = readBytes(4);
            Array.Reverse(m_buffer);
            return BitConverter.ToSingle(m_buffer, 0);
        }

        public double readDoubleLE(long offset = -1)
        {
            fixReadOffset(offset);
            m_buffer = readBytes(8);
            return BitConverter.ToDouble(m_buffer, 0);
        }

        public double readDoubleBE(long offset = -1)
        {
            fixReadOffset(offset);
            m_buffer = readBytes(8);
            Array.Reverse(m_buffer);
            return BitConverter.ToDouble(m_buffer, 0);
        }

        public Boolean readBool(long offset = -1)
        {
            fixReadOffset(offset);
            m_buffer = readBytes(1);
            return m_buffer[0] != 0;
        }

        public string readStringByEmpty(long offset = -1)
        {
            fixReadOffset(offset);
            List<byte> bytes = new List<byte>();
            byte tp;
            while (true)
            {
                if ((tp = readUInt8()) == 0)
                {
                    break;
                }
                bytes.Add(tp);
            }
            byte[] byte_str = bytes.ToArray();
            return Encode.GetString(byte_str);
        }

        public string getStringByEmpty(long offset)
        {
            long tempOffset = readOffset;
            readOffset = offset;
            string str = readStringByEmpty();
            readOffset = tempOffset;
            return str;
        }

        public string readStringByVarInt32(long offset = -1)
        {
            fixReadOffset(offset);
            return readString(readVarInt32());
        }


        // Write
        public void writeBytes(byte[] array, long offset = -1)
        {
            fixWriteOffset(offset);
            int length = array.Length;
            baseStream.Write(array, 0, length);
            writeOffset += length;
        }

        public void writeString(string str, long offset = -1, string EncodingType = "UTF-8")
        {
            Encoding encoding = Encoding.GetEncoding(EncodingType);
            byte[] str_bytes = encoding.GetBytes(str);
            writeBytes(str_bytes);
        }

        public void setBytes(byte[] array, long offset, Boolean overwriteOffset)
        {
            int length = array.Length;
            if (overwriteOffset)
            {
                fixWriteOffset(offset);
            }
            else
            {
                baseStream.Position = offset;
            }
            baseStream.Write(array, 0, length);
            baseStream.Position = writeOffset;
        }

        public void writeUInt8(sbyte number, long offset = -1)
        {
            fixWriteOffset(offset);
            m_buffer = new byte[1];
            m_buffer[0] = (byte)number;
            writeBytes(m_buffer);
        }

        public void writeUInt16LE(ushort number, long offset = -1)
        {
            fixWriteOffset(offset);
            m_buffer = new byte[2];
            m_buffer[0] = (byte)number;
            m_buffer[1] = (byte)(number >> 8);
            writeBytes(m_buffer);
        }

        public void writeUInt16BE(ushort number, long offset = -1)
        {
            fixWriteOffset(offset);
            m_buffer = new byte[2];
            m_buffer[1] = (byte)number;
            m_buffer[0] = (byte)(number >> 8);
            writeBytes(m_buffer);
        }

        public void writeUInt24LE(uint number, long offset = -1)
        {
            fixWriteOffset(offset);
            m_buffer = new byte[3];
            m_buffer[0] = (byte)number;
            m_buffer[1] = (byte)(number >> 8);
            m_buffer[2] = (byte)(number >> 16);
            writeBytes(m_buffer);
        }

        public void writeUInt24BE(uint number, long offset = -1)
        {
            fixWriteOffset(offset);
            m_buffer = new byte[3];
            m_buffer[2] = (byte)number;
            m_buffer[1] = (byte)(number >> 8);
            m_buffer[0] = (byte)(number >> 16);
            writeBytes(m_buffer);
        }

        public void writeUInt32LE(uint number, long offset = -1)
        {
            fixWriteOffset(offset);
            m_buffer = new byte[4];
            m_buffer[0] = (byte)number;
            m_buffer[1] = (byte)(number >> 8);
            m_buffer[2] = (byte)(number >> 16);
            m_buffer[3] = (byte)(number >> 24);
            writeBytes(m_buffer);
        }

        public void writeUInt32BE(uint number, long offset = -1)
        {
            fixWriteOffset(offset);
            m_buffer = new byte[4];
            m_buffer[3] = (byte)number;
            m_buffer[2] = (byte)(number >> 8);
            m_buffer[1] = (byte)(number >> 16);
            m_buffer[0] = (byte)(number >> 24);
            writeBytes(m_buffer);
        }

        public void writeBigUInt64LE(ulong number, long offset = -1)
        {
            fixWriteOffset(offset);
            m_buffer = new byte[8];
            m_buffer[0] = (byte)number;
            m_buffer[1] = (byte)(number >> 8);
            m_buffer[2] = (byte)(number >> 16);
            m_buffer[3] = (byte)(number >> 24);
            m_buffer[4] = (byte)(number >> 32);
            m_buffer[5] = (byte)(number >> 40);
            m_buffer[6] = (byte)(number >> 48);
            m_buffer[7] = (byte)(number >> 56);
            writeBytes(m_buffer);
        }

        public void writeBigUInt64BE(ulong number, long offset = -1)
        {
            fixWriteOffset(offset);
            m_buffer = new byte[8];
            m_buffer[7] = (byte)number;
            m_buffer[6] = (byte)(number >> 8);
            m_buffer[5] = (byte)(number >> 16);
            m_buffer[4] = (byte)(number >> 24);
            m_buffer[3] = (byte)(number >> 32);
            m_buffer[2] = (byte)(number >> 40);
            m_buffer[1] = (byte)(number >> 48);
            m_buffer[0] = (byte)(number >> 56);
            writeBytes(m_buffer);
        }

        public void writeFloatLE(float number, long offset = -1)
        {
            m_buffer = BitConverter.GetBytes(number);
            fixWriteOffset(offset);
            writeBytes(m_buffer);

        }

        public void writeFloatBE(float number, long offset = -1)
        {
            m_buffer = BitConverter.GetBytes(number);
            Array.Reverse(m_buffer);
            fixWriteOffset(offset);
            writeBytes(m_buffer);

        }

        public void writeDoubleLE(double number, long offset = -1)
        {
            m_buffer = BitConverter.GetBytes(number);
            fixWriteOffset(offset);
            writeBytes(m_buffer);
        }

        public void writeDoubleBE(double number, long offset = -1)
        {
            m_buffer = BitConverter.GetBytes(number);
            Array.Reverse(m_buffer);
            fixWriteOffset(offset);
            writeBytes(m_buffer);
        }
        public void writeUVarInt32(uint number, long offset = -1)
        {
            uint num;
            List<byte> bytes = new List<byte>();
            for (num = number; num >= 128; num >>= 7)
            {
                bytes.Add((byte)(num | 0x80));
            }
            bytes.Add((byte)num);
            m_buffer = bytes.ToArray();
            fixWriteOffset(offset);
            writeBytes(m_buffer);
        }

        public void writeUVarInt64(ulong number, long offset = -1)
        {
            ulong num;
            List<byte> bytes = new List<byte>();
            for (num = number; num >= 128; num >>= 7)
            {
                bytes.Add((byte)(num | 0x80));
            }
            bytes.Add((byte)num);
            m_buffer = bytes.ToArray();
            fixWriteOffset(offset);
            writeBytes(m_buffer);
        }

        public void writeVarInt32(int number, long offset = -1)
        {
            uint num;
            List<byte> bytes = new List<byte>();
            for (num = (uint)number; num >= 128; num >>= 7)
            {
                bytes.Add((byte)(num | 0x80));
            }
            bytes.Add((byte)num);
            m_buffer = bytes.ToArray();
            fixWriteOffset(offset);
            writeBytes(m_buffer);
        }

        public void writeVarInt64(long number, long offset = -1)
        {
            ulong num;
            List<byte> bytes = new List<byte>();
            for (num = (ulong)number; num >= 128; num >>= 7)
            {
                bytes.Add((byte)(num | 0x80));
            }
            bytes.Add((byte)num);
            m_buffer = bytes.ToArray();
            fixWriteOffset(offset);
            writeBytes(m_buffer);
        }

        public void writeBool(bool value, long offset = -1)
        {
            m_buffer = new byte[1];
            m_buffer[0] = (byte)(value ? 1u : 0u);
            fixWriteOffset(offset);
            writeBytes(m_buffer);
        }

        public void writeZigZag32(int number, long offset = -1)
        {
            fixWriteOffset(offset);
            writeVarInt32((number << 1) ^ (number >> 31));
        }

        public void writeZigZag64(long number, long offset = -1)
        {
            fixWriteOffset(offset);
            writeVarInt64((number << 1) ^ (number >> 63));
        }
        public void writeStringByVarInt32(string str, long offset = -1)
        {
            fixWriteOffset(offset);
            if (str == null)
            {
                writeVarInt32(0);
                return;
            }
            m_buffer = Encode.GetBytes(str);
            writeVarInt32(m_buffer.Length);
            writeBytes(m_buffer);
        }

        public void writeSenBuffer(SenBuffer input, long offset = -1)
        {
            m_buffer = input.toBytes();
            fixWriteOffset(offset);
            writeBytes(m_buffer);
        }

        public byte[] toBytes()
        {
            long temp_offset = baseStream.Position;
            byte[] bytes;
            if (baseStream is MemoryStream ms)
            {
                bytes = ms.ToArray();
            }
            else
            {
                bytes = new byte[baseStream.Length - baseStream.Position];
                using (MemoryStream ms2 = new MemoryStream(bytes))
                {
                    baseStream.CopyTo(ms2);
                }
            }
            baseStream.Position = temp_offset;
            return bytes;
        }
        public virtual void OutFile(string output_path)
        {
            List<string> file_path_collection = output_path.Replace("\\", "/").Split("/").ToList<string>();
            var last_index = file_path_collection.Count - 1;
            string requirement_file = file_path_collection.ElementAt<string>(last_index);
            file_path_collection.RemoveAt(last_index);
            var path = new Implement_Path();
            var output_directory = "";
            var fs = new FileSystem();
            foreach (var directory in file_path_collection.ToArray<string>())
            {
                if (!fs.DirectoryExists(directory))
                {
                    fs.CreateDirectory(directory);
                }
                output_directory = path.Join(output_directory, directory);
            }
            SaveFile(output_path);
        }

        public virtual void SaveFile(string path)
        {
            using (var fileStream = new FileStream(path, FileMode.Create))
            {
                baseStream.Seek(0, SeekOrigin.Begin);
                baseStream.CopyTo(fileStream);
            }
            Close();
        }
        public virtual void Close()
        {
            baseStream.Close();
        }

        public virtual void Flush()
        {
            baseStream.Flush();
        }
    }
}