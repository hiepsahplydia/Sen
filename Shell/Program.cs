﻿using Sen.Shell.Modules.Standards;
using Sen.Shell.Modules.JavaScript;

namespace Sen.Shell
{
     internal class Program
    {
        public static int Main(string[] args)
        {
            var SystemConsole = new SystemImplement();
            var Script_Directory = $"{Platform.CurrentDirectoryContainsShell}/Scripts";
            try
            {
                Engine.Evaluate(ref Script_Directory, args);
            }
            catch (Exception ex)
            {
                Engine.EvaluateError(ref Script_Directory, ex);
            }
            finally
            {
                SystemConsole.TerminateProgram();
            }
            return 0;
        }
    }
}
